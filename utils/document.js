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

const extract = (content, schemaIds) => {
    const data = schemaIds.reduce(
        (results, schemaId) => ({
            ...results,
            [schemaId]: findBySchemaId(content, schemaId) }), {}
    );

    return {
        values: schemaId => schemaId in data ? data[schemaId].map( a => a.content ) : undefined,
        firstValue: schemaId => schemaId in data ? data[schemaId][0].content.value : undefined,
        idOf: schemaId => schemaId in data ? data[schemaId][0].id : undefined,
        verify: (schemaIds, errorMessage) =>
            schemaIds
                .filter( schemaId => schemaId in data )
                .filter( schemaId => data[schemaId].reduce(
                    (result, d) => result && d.content.value.length === 0,
                    true))
                .map( schemaId => createMessage('error', errorMessage, data[schemaId][0].id))
    };
};

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
    extract: extract,
    createMessage: createMessage,
    createReplaceOperation: createReplaceOperation };