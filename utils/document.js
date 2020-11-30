// --- HELPER FUNCTIONS ---

// Return datapoints matching a schema id.
// @param {Object} content - the annotation content tree (see https://api.elis.rossum.ai/docs/#annotation-data)
// @param {string} schemaId - the field's ID as defined in the extraction schema(see https://api.elis.rossum.ai/docs/#document-schema)
// @returns {Array} - the list of datapoints matching the schema ID

const findBySchemaId = (content, schemaId) =>
    content.reduce(
        (results, dp) =>
            dp.schema_id === schemaId ? [...results, dp] :
                dp.children ? [...results, ...findBySchemaId(dp.children, schemaId)] :
                    results,
        []
    );

// Return datapoints matching an array of schema ids.
// @param {Object} content - the annotation content tree (see https://api.elis.rossum.ai/docs/#annotation-data)
// @param {string} schemaIds - an array of field's IDs as defined in the extraction schema(see https://api.elis.rossum.ai/docs/#document-schema)
// @returns {Object} - key is the schema id, value is the list of datapoints matching the schema ID

const findBySchemaIdBulk = (content, schemaIds) =>
    schemaIds.reduce(
        (results, schemaId) => {
            results[schemaId] = findBySchemaId( content, schemaId );
            return results;
        },
        {
            valueOf: function (schemaId) { return schemaId in this ? this[schemaId][0].content.value : undefined; },
            idOf: function (schemaId) { return schemaId in this ? this[schemaId][0].id : undefined; }
        }
    );

// Return an array with warnings for all schemaIds in the bulk object that have an empty annotation
// @param {Object} bulk - the output of the findBySchemaIdBulk function
// @param {string} schemaIds - an array of field's IDs as defined in the extraction schema(see https://api.elis.rossum.ai/docs/#document-schema)
// @param {string} errorMessage - the returned error message, string ${SCHEMA_ID} is replaced by the schema id (label is not available in the annotation object)
// @returns {Array} - the list of warning messages matching the schema ID

const verifyInBulk = (bulk, schemaIds, errorMessage) =>
    schemaIds
        .filter( schemaId => schemaId in bulk )
        .filter( schemaId => bulk[schemaId].reduce(
            (result, data) => result && data.content.value.length === 0,
            true))
        .map( schemaId => createMessage('warning',
            errorMessage.replace(/\${SCHEMA_ID}/g, schemaId),
            bulk[schemaId][0].id) );

// Return datapoints matching a search term in "rir_text".
// @param {Object} content - the annotation content tree (see https://api.elis.rossum.ai/docs/#annotation-data)
// @param {string} searchTerm - the searched term
// @returns {Array} - the list of datapoints matching the schema ID

const findInRir = (content, searchTerm) =>
    content.reduce(
        (results, dp) =>
            'content' in dp && 'rir_text' in dp.content && dp.content.rir_text === searchTerm ? [...results, dp] :
                dp.children ? [...results, ...findInRir(dp.children, searchTerm)] :
                    results,
        []
    );

// Create a message which will be shown to the user
// @param {number} datapointId - the id of the datapoint where the message will appear (null for "global" messages).
// @param {String} messageType - the type of the message, any of {info|warning|error}. Errors prevent confirmation in the UI.
// @param {String} messageContent - the message shown to the user
// @returns {Object} - the JSON message definition (see https://api.elis.rossum.ai/docs/#annotation-content-event-response-format)

const createMessage = (type, content, datapointId = null) => ({
    content: content,
    type: type,
    id: datapointId,
});

// Replace the value of the datapoint with a new value.
// @param {Object} datapoint - the content of the datapoint
// @param {string} - the new value of the datapoint
// @return {Object} - the JSON replace operation definition (see https://api.elis.rossum.ai/docs/#annotation-content-event-response-format)

const createReplaceOperation = (datapoint, newValue) => ({
    op: 'replace',
    id: datapoint.id,
    value: {
        content: {
            value: newValue,
        },
    },
});

module.exports = {
    findBySchemaId: findBySchemaId,
    findBySchemaIdBulk: findBySchemaIdBulk,
    verifyInBulk: verifyInBulk,
    findInRir: findInRir,
    createMessage: createMessage,
    createReplaceOperation: createReplaceOperation };