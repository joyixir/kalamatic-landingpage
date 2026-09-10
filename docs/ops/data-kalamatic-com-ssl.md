# data.kalamatic.com SSL Incident

This note documents an external infrastructure issue that affects the game runtime but is not fixable from the landing page codebase itself.

## Problem

Unity reports:

```text
Curl error 60: Cert verify failed. Certificate Common Name(CN) does not match with the expected CN.
```

The failing host is:

```text
https://data.kalamatic.com/
```

Observed behavior:

- `payment.kalamatic.com` is healthy
- `data.kalamatic.com` is unhealthy
- `data.kalamatic.com` resolves to `185.83.183.106`
- requesting `https://data.kalamatic.com/` returns a certificate for:
  - `CN=ordibeheshtstudio.com`

That certificate does not match `data.kalamatic.com`, so TLS validation fails in Unity.

## Impact

This breaks the game's level download flow for endpoints such as:

```text
https://data.kalamatic.com/WorldOfWords/{language}/LevelsJson/...
```

Expected affected assets include:

- `LevelsInformation.txt`
- level `.gz` files

## Required Fix

This must be fixed on the infrastructure side, not in this repository.

Check:

1. DNS for `data.kalamatic.com`
2. nginx / apache / vhost configuration on `185.83.183.106`
3. active certificate bindings for `data.kalamatic.com`
4. whether the `data.kalamatic.com` server block is accidentally serving the `ordibeheshtstudio.com` certificate
5. web server reload / restart after updating cert or vhost config

## Validation Commands

```bash
curl -Ivs https://data.kalamatic.com/
openssl s_client -connect data.kalamatic.com:443 -servername data.kalamatic.com
```

Expected result after repair:

- certificate SAN / CN matches `data.kalamatic.com`
- Unity can download the level metadata and compressed level files again

## What To Provide If Someone Else Should Fix It

If you want another engineer to troubleshoot the server directly, give them at least one of these:

- SSH / server access method
- nginx or apache config path
- DNS provider details
- proxy / CDN / Cloudflare details, if any

## Scope Note

This repository contains the Kalamatic landing page and GitHub Pages deployment workflow only.
It does not contain:

- the game backend
- the `data.kalamatic.com` web server config
- TLS certificate provisioning for `data.kalamatic.com`
