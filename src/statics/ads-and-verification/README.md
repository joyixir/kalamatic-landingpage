This folder contains optional site-root files for ad systems and domain verification.

They are disabled by default.

The build toggle lives in:
- `src/statics/ads-and-verification-config.js`

Current review notes before enabling:
- `ads.txt` and `app-ads.txt` are currently identical
- both files still contain the placeholder `[yourIronosurcePublisherAccountID]`
- both files include a section labeled `#app-ads for Delivery Run`, which may belong to another app or an older shared export
- the seller list is large and should be reviewed for current relevance before publishing
