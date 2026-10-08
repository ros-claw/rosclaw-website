# Registry discovery and SEO

The Hub exposes approved MCPs and Skills as server-rendered, canonical pages. Catalog size alone does not guarantee Google indexing or rankings. Source documentation, useful navigation, reliable responses, and relevance to a query matter.

## Implemented behavior

- Read the entire approved catalog in bounded database batches, including projects with a response cap below 1,000 rows. Incomplete reads fail instead of silently presenting a partial catalog.
- Show 24 items per browse page. Pagination uses real links such as `/hub/skills?page=2`, with a self-referencing canonical for each page. Search and sorting remain interactive conveniences, not separate indexable URLs.
- Add source-metadata-based topic collections under `/hub/{skills,mcps}/category/{topic}`. These group packages for discovery; they do not attest compatibility or hardware verification.
- Include every approved detail page, browse page, and nonempty topic collection in `/sitemap.xml`. Detail `lastmod` reflects upstream modification, not merely a scheduled synchronization. Database outages fail sitemap generation rather than publish a misleading partial sitemap.
- Give detail pages source-based setup/usage excerpts, declared requirements, related-package links, individual metadata, breadcrumbs, and SoftwareSourceCode structured data. No generated installation commands, invented ratings, or unsupported compatibility claims.
- Keep Skill source links pointed at the concrete upstream directory when applicable, including `ros-claw/skills/tree/main/skills/realsense_ops`.

## Checks

```bash
npm test
npm run build
# Production HTML, sitemap coverage, pagination, topics, and source links:
npm run test:seo:live
# Run against a local server instead:
ROSCLAW_SITE_URL=http://localhost:3000 npm run test:seo:live
```

The live check compares all public catalog entries with sitemap URLs. When Supabase public environment variables are available, it also compares API lengths with exact approved database counts. It does not measure actual Google indexing or search traffic.

## Google Search Console：站长操作

1. 打开 [Google Search Console](https://search.google.com/search-console/)，登录管理网站的 Google 账号。
2. 如果已经有 `rosclaw.io` 的资源，直接选择它，不必再次验证。
3. 如果没有，可以新增网址前缀资源 `https://www.rosclaw.io/`，选择「HTML 标记」验证。复制标记中 `content="..."` 的值，在 Vercel 项目环境变量里新增 `GOOGLE_SITE_VERIFICATION`，选择 Production，然后重新部署。不要把整段 HTML 放进变量。网站已支持输出该验证标记；部署完成后返回 Search Console 点击「验证」。域名资源的 DNS 验证也是可选方案。
4. 在左侧「站点地图」提交 `https://www.rosclaw.io/sitemap.xml`。无需逐个提交几千个详情页。
5. 用「网址检查」抽查 Skills/MCP 首页、分页、分类页和几个详情页。只对重要的新页面申请索引，不要批量重复申请。
6. 在「网页索引」查看是否抓取成功及未收录原因；在「效果」观察展示次数、点击次数和查询词。每周记录一次，同样比较最近 28 天与前 28 天，区分品牌词和机器人/MCP/Skill 相关长尾词。

Baseline on 2026-10-09: 1,652 approved Skills, 444 approved MCPs, and 2,366 unique sitemap URLs, checked against the live database in local acceptance tests. These are site-coverage counts, **not** Google-indexed page counts. New imports will change them.

Search Console data requires access to the verified property through the owner's account or an authenticated connection. Without that access, the website cannot establish actual indexed pages, impressions, clicks, or ranking improvements. Never place a Google account password or access token in repository files or chat.
