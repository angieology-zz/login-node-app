const admin = require("firebase-admin");
const functions = require("firebase-functions");
const moment = require("moment");
const stringify = require("csv-stringify");

const AGREEMENTS_EXPORT_DISPLAY_DATE_FORMAT = "MMMM D, YYYY [at] h:mma";
const AGREEMENTS_EXPORT_INTERNAL_DATE_FORMAT = "YYYY-MM-DD";
const AGREEMENTS_EXPORT_INTERNAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Copy of backend firebase agreements util
 * todo:
 * 1. get one agreement by ID
 * 2. update agreement by ID
 * 3. add flag (sold)/delete
 */


exports.exportPurchaseAndSaleAgreements = functions.https.onRequest(
    (req, res) => {
      // Get query parameters:
      const { authKey, startDate, endDate } = req.query;
  
      // Verify authentication:
      const { admin: adminConfig = {} } = functions.config();
      const { auth: authConfig = {} } = adminConfig;
  
      if (!authConfig.key) {
        res.status(401).send("Authentication is not configured.");
        return;
      }
  
      if (!authKey || authKey !== authConfig.key) {
        res.status(401).send("The authKey parameter is missing or invalid.");
        return;
      }
  
      // Validate start date param:
      if (startDate && !AGREEMENTS_EXPORT_INTERNAL_DATE_PATTERN.test(startDate)) {
        res
          .status(400)
          .send(
            `The startDate parameter must have the format ${AGREEMENTS_EXPORT_INTERNAL_DATE_FORMAT}.`
          );
        return;
      }
  
      // Validate end date param:
      if (endDate && !AGREEMENTS_EXPORT_INTERNAL_DATE_PATTERN.test(endDate)) {
        res
          .status(400)
          .send(
            `The endDate parameter must have the format ${AGREEMENTS_EXPORT_INTERNAL_DATE_FORMAT}.`
          );
        return;
      }
  
      getPurchaseAndSaleAgreements(startDate, endDate).then(
        ({ buyAgreements, sellAgreements }) => {
          const buyAgreementRecords = formatPurchaseAndSaleAgreementRecords(
            buyAgreements,
            "buy"
          );
          const sellAgreementRecords = formatPurchaseAndSaleAgreementRecords(
            sellAgreements,
            "sell"
          );
          const allAgreementRecords = buyAgreementRecords.concat(
            sellAgreementRecords
          );
  
          stringify(allAgreementRecords, { header: true }, function(error, csv) {
            if (error) {
              res.status(500).send(JSON.stringify(error));
            } else {
              res.set(
                "Content-Disposition",
                "attachment; filename=Nobul-Purchase-Sale-Agreements.csv"
              );
              res.set("Content-Type", "text/csv");
              res.status(200).send(csv);
            }
          });
        }
      );
    }
  );
  
  const getPurchaseAndSaleAgreements = function(startDate, endDate) {
    if (startDate && endDate) {
      return getPurchaseAndSaleAgreementsCreatedWithinDateRange(
        startDate,
        endDate
      );
    } else if (startDate) {
      return getPurchaseAndSaleAgreementsCreatedAfterDate(startDate);
    } else if (endDate) {
      return getPurchaseAndSaleAgreementsCreatedBeforeDate(endDate);
    } else {
      return getAllPurchaseAndSaleAgreements();
    }
  };
  
  const getPurchaseAndSaleAgreementsCreatedWithinDateRange = function(
    startDate,
    endDate
  ) {
    const timestamp = moment(
      endDate,
      AGREEMENTS_EXPORT_INTERNAL_DATE_FORMAT
    ).valueOf();
  
    return getPurchaseAndSaleAgreementsCreatedAfterDate(startDate).then(
      ({ buyAgreements, sellAgreements }) => {
        const filteredBuyAgreements = Object.keys(buyAgreements)
          .filter(agreementId => {
            const { createdAt = 0 } = buyAgreements[agreementId] || {};
            return createdAt && createdAt <= timestamp;
          })
          .reduce((filtered, agreementId) => {
            return Object.assign({}, filtered, {
              [agreementId]: buyAgreements[agreementId]
            });
          }, {});
  
        const filteredSellAgreements = Object.keys(sellAgreements)
          .filter(agreementId => {
            const { createdAt = 0 } = sellAgreements[agreementId] || {};
            return createdAt && createdAt <= timestamp;
          })
          .reduce((filtered, agreementId) => {
            return Object.assign({}, filtered, {
              [agreementId]: sellAgreements[agreementId]
            });
          }, {});
  
        return Promise.resolve({
          buyAgreements: filteredBuyAgreements,
          sellAgreements: filteredSellAgreements
        });
      }
    );
  };
  
  const getPurchaseAndSaleAgreementsCreatedAfterDate = function(startDate) {
    const timestamp = moment(
      startDate,
      AGREEMENTS_EXPORT_INTERNAL_DATE_FORMAT
    ).valueOf();
  
    const queries = [
      admin
        .database()
        .ref("purchaseAndSaleAgreements/buy")
        .orderByChild("createdAt")
        .startAt(timestamp)
        .once("value"),
      admin
        .database()
        .ref("purchaseAndSaleAgreements/sell")
        .orderByChild("createdAt")
        .startAt(timestamp)
        .once("value")
    ];
  
    return Promise.all(queries).then(
      ([buyAgreementsSnapshot, sellAgreementsSnapshot]) => {
        return Promise.resolve({
          buyAgreements: buyAgreementsSnapshot.val() || {},
          sellAgreements: sellAgreementsSnapshot.val() || {}
        });
      }
    );
  };
  
  const getPurchaseAndSaleAgreementsCreatedBeforeDate = function(endDate) {
    const timestamp = moment(
      endDate,
      AGREEMENTS_EXPORT_INTERNAL_DATE_FORMAT
    ).valueOf();
  
    const queries = [
      admin
        .database()
        .ref("purchaseAndSaleAgreements/buy")
        .orderByChild("createdAt")
        .endAt(timestamp)
        .once("value"),
      admin
        .database()
        .ref("purchaseAndSaleAgreements/sell")
        .orderByChild("createdAt")
        .endAt(timestamp)
        .once("value")
    ];
  
    return Promise.all(queries).then(
      ([buyAgreementsSnapshot, sellAgreementsSnapshot]) => {
        return Promise.resolve({
          buyAgreements: buyAgreementsSnapshot.val() || {},
          sellAgreements: sellAgreementsSnapshot.val() || {}
        });
      }
    );
  };
  
  const getAllPurchaseAndSaleAgreements = function() {
    const queries = [
      admin
        .database()
        .ref("purchaseAndSaleAgreements/buy")
        .orderByChild("createdAt")
        .once("value"),
      admin
        .database()
        .ref("purchaseAndSaleAgreements/sell")
        .orderByChild("createdAt")
        .once("value")
    ];
  
    return Promise.all(queries).then(
      ([buyAgreementsSnapshot, sellAgreementsSnapshot]) => {
        return Promise.resolve({
          buyAgreements: buyAgreementsSnapshot.val() || {},
          sellAgreements: sellAgreementsSnapshot.val() || {}
        });
      }
    );
  };
  
  const formatPurchaseAndSaleAgreementRecords = function(
    agreements = {},
    jobType = ""
  ) {
    return Object.keys(agreements).map(agreementId => {
      const {
        createdAt = 0,
        closingDate = 0,
        agentId = "",
        serviceAgreementId = "",
        sellingPrice = "",
        agentCommission = "",
        cashPayment = ""
      } =
        agreements[agreementId] || {};
  
      const record = {
        Date: moment(createdAt).format(AGREEMENTS_EXPORT_DISPLAY_DATE_FORMAT),
        "Closing Date": moment(closingDate).format(
          AGREEMENTS_EXPORT_DISPLAY_DATE_FORMAT
        ),
        "Job Type": jobType,
        "Agreement ID": agreementId,
        "Service Agreement Id": serviceAgreementId,
        "Agent ID": agentId,
        "Agent Commission": agentCommission,
        "Selling Price": sellingPrice,
        "Cash Payment": cashPayment
      };
  
      return record;
    });
  };