// Keep catalog responses small: README and long-description bodies belong only
// on detail pages. The same projections serve SSR and JSON list APIs.
export const MCP_LIST_COLUMNS = "id,name,description,author_name,github_repo_url,github_updated_at,last_synced_at,category,robot_type,version,github_stars,views_count,downloads_count,rating,tags,tools,is_verified,manifest_validated_at,manifest_validation_evidence";

export const SKILL_LIST_COLUMNS = "id,name,display_name,description,author_name,author_url,github_repo_url,github_updated_at,last_synced_at,category,version,github_stars,views_count,downloads_count,rating,review_count,status,robot_types,tags,dependencies,icon_url";
