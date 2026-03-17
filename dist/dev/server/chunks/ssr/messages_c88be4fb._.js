module.exports = [
"[project]/messages/en.json (json, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/messages_en_json_a7997480._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/messages/en.json (json)");
    });
});
}),
"[project]/messages/zh.json (json, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/messages_zh_json_36af904a._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/messages/zh.json (json)");
    });
});
}),
];