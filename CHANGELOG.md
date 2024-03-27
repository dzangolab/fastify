## [0.64.1](https://github.com/dzangolab/fastify/compare/v0.64.0...v0.64.1) (2024-03-27)


### Bug Fixes

* **deps:** update dependency nodemailer to v6.9.9 [security] ([#607](https://github.com/dzangolab/fastify/issues/607)) ([f37d349](https://github.com/dzangolab/fastify/commit/f37d3492cbff5b57f55dbfa5cd88f293b957f225))
* **multi-tenant:** add 404 status code in response if such tenant does not exits ([#628](https://github.com/dzangolab/fastify/issues/628)) ([10bc5b2](https://github.com/dzangolab/fastify/commit/10bc5b263e80f2bc328c33a76f3067d36c3560d5))
* **user:** block create role if it already exists ([#629](https://github.com/dzangolab/fastify/issues/629)) ([65cfb29](https://github.com/dzangolab/fastify/commit/65cfb29af0d448a715c53a02fcf903a570c75902))



# [0.64.0](https://github.com/dzangolab/fastify/compare/v0.63.0...v0.64.0) (2024-03-23)


### Features

* **user:** add permissions while creating role ([#622](https://github.com/dzangolab/fastify/issues/622)) ([5023a51](https://github.com/dzangolab/fastify/commit/5023a5151a210b4a6d71b83be53e08c16e2a4cd3))



# [0.63.0](https://github.com/dzangolab/fastify/compare/v0.62.4...v0.63.0) (2024-03-22)


### Features

* **config:** add multi-stream support for logger config ([#616](https://github.com/dzangolab/fastify/issues/616)) ([d9ebb2e](https://github.com/dzangolab/fastify/commit/d9ebb2efc4a5785d5e2b6519b4decb1014f6f1af))



## [0.62.4](https://github.com/dzangolab/fastify/compare/v0.62.3...v0.62.4) (2024-03-21)


### Bug Fixes

* update db filter input type ([#624](https://github.com/dzangolab/fastify/issues/624)) ([7a24d4c](https://github.com/dzangolab/fastify/commit/7a24d4c1a1f308fc9d33d0f387d3866b8dac1e05))



## [0.62.3](https://github.com/dzangolab/fastify/compare/v0.62.2...v0.62.3) (2024-03-20)



## [0.62.2](https://github.com/dzangolab/fastify/compare/v0.62.1...v0.62.2) (2024-03-07)


### Features

* **multi-tenant:** check reserved slugs and domains before create tenant ([#606](https://github.com/dzangolab/fastify/issues/606)) ([79db810](https://github.com/dzangolab/fastify/commit/79db810285c59d444e59b598714381896d815f30))



## [0.62.1](https://github.com/dzangolab/fastify/compare/v0.62.0...v0.62.1) (2024-02-19)


### Features

* return host in tenant all request ([#614](https://github.com/dzangolab/fastify/issues/614)) ([058308a](https://github.com/dzangolab/fastify/commit/058308a201615ee4e69a0a8a6f5b351103ae0aee))
* **user:** make invitations and user service configurable  ([#511](https://github.com/dzangolab/fastify/issues/511)) ([3659f26](https://github.com/dzangolab/fastify/commit/3659f26c73007b8c99f391d0b95ddc5e2f9e2ae7))



# [0.62.0](https://github.com/dzangolab/fastify/compare/v0.61.1...v0.62.0) (2024-02-12)


### Features

* **user:** add support for custom third party provider ([#608](https://github.com/dzangolab/fastify/issues/608)) ([1a4ae53](https://github.com/dzangolab/fastify/commit/1a4ae53a8d3be37a56b0179a773e5fa77d72306d))



## [0.61.1](https://github.com/dzangolab/fastify/compare/v0.61.0...v0.61.1) (2024-02-12)


### Bug Fixes

* remove role check in user enable and disable graphql resolver ([#611](https://github.com/dzangolab/fastify/issues/611)) ([2d84f4b](https://github.com/dzangolab/fastify/commit/2d84f4b13b425b34d91683f7c63d59bfcd38b726))



# [0.61.0](https://github.com/dzangolab/fastify/compare/v0.60.0...v0.61.0) (2024-01-30)


### Features

* **multi-tenant:** add endpoint to get all tenants ([#604](https://github.com/dzangolab/fastify/issues/604)) ([70ed7bd](https://github.com/dzangolab/fastify/commit/70ed7bd3dec65f88b83332a1f7b331364beecdae))
* **user:** auto verify first admin user email when email verification is enabled ([#603](https://github.com/dzangolab/fastify/issues/603)) ([e9ccf84](https://github.com/dzangolab/fastify/commit/e9ccf844fb06940f67da41ac87f9712aa428e941))



# [0.60.0](https://github.com/dzangolab/fastify/compare/v0.59.0...v0.60.0) (2024-01-26)


### Features

* **user:** make accept invitation link path configurable ([#601](https://github.com/dzangolab/fastify/issues/601)) ([5d5aa1f](https://github.com/dzangolab/fastify/commit/5d5aa1fbd94aabf2d969a463cda4f750c3753d18))



# [0.59.0](https://github.com/dzangolab/fastify/compare/v0.58.0...v0.59.0) (2024-01-25)


### Bug Fixes

* **deps:** update dependency zod to v3.22.4 ([#591](https://github.com/dzangolab/fastify/issues/591)) ([b0b6b61](https://github.com/dzangolab/fastify/commit/b0b6b619e0c0bb0ac292d31752ad93c1f9e1fc0b))
* **user:** fix link in email verification for first admin sign up ([#598](https://github.com/dzangolab/fastify/issues/598)) ([f991df5](https://github.com/dzangolab/fastify/commit/f991df5f076d7526501f83e27c0f04a0446d2b51))


### Features

* **multi-tenant:** add tenant owner role on  sign up from www app ([#586](https://github.com/dzangolab/fastify/issues/586)) ([49c341d](https://github.com/dzangolab/fastify/commit/49c341d0d474744b93d0581a5f6d19bfbbff940b))



# [0.58.0](https://github.com/dzangolab/fastify/compare/v0.57.1...v0.58.0) (2024-01-16)


### Bug Fixes

* **deps:** update dependency @types/busboy to v1.5.3 ([#559](https://github.com/dzangolab/fastify/issues/559)) ([da0cf54](https://github.com/dzangolab/fastify/commit/da0cf5454c5c3a18ebbbbadfe0f525573daa4ffa))
* **deps:** update dependency nodemailer to v6.9.8 ([#589](https://github.com/dzangolab/fastify/issues/589)) ([0dc1a7d](https://github.com/dzangolab/fastify/commit/0dc1a7d8a1e028a816ed1cbbecb08ad1f462f585))
* **deps:** update dependency uuid to v9.0.1 ([#590](https://github.com/dzangolab/fastify/issues/590)) ([3537316](https://github.com/dzangolab/fastify/commit/35373164f848a407ccd9241b976e1085c268bf02))


### Features

* **multi-tenant:** add owner information on creating tenant ([3ca2756](https://github.com/dzangolab/fastify/commit/3ca27560e820bd7953e579ab9195962cb43f630e))
* **multi-tenant:** As A tenant owner, I can only get tenants or a tenant created by me. ([#588](https://github.com/dzangolab/fastify/issues/588)) ([6c7bebb](https://github.com/dzangolab/fastify/commit/6c7bebbfbc4442c33506900468e46ea0527d6819))



## [0.57.1](https://github.com/dzangolab/fastify/compare/v0.57.0...v0.57.1) (2024-01-08)



# [0.57.0](https://github.com/dzangolab/fastify/compare/v0.56.0...v0.57.0) (2024-01-04)


### Features

* **user:** add role based access control (hasPermission middleware and directive to protect routes)  ([#564](https://github.com/dzangolab/fastify/issues/564)) ([eca8909](https://github.com/dzangolab/fastify/commit/eca8909c8f5d23182531077ed8a9ee2fd5b8c5b6))
* **multi-tenant:** add tenant controller and resolver ([#574](https://github.com/dzangolab/fastify/issues/574)) ([95bb1f9](https://github.com/dzangolab/fastify/commit/95bb1f96ac1b4a3218047a6aa219eb00dfe67d89))



# [0.56.0](https://github.com/dzangolab/fastify/compare/v0.55.2...v0.56.0) (2023-12-25)


### Features

* add payload support in send notification route ([#581](https://github.com/dzangolab/fastify/issues/581)) ([68c3f9a](https://github.com/dzangolab/fastify/commit/68c3f9a3421083188096034b4cdf7af28f418bd6))
* **user:** fix create invitation issue when default role is not USER ([#565](https://github.com/dzangolab/fastify/issues/565)) ([7260f11](https://github.com/dzangolab/fastify/commit/7260f11c28164044094184f96f386a5259449bc5))



## [0.55.2](https://github.com/dzangolab/fastify/compare/v0.55.1...v0.55.2) (2023-12-20)



## [0.55.1](https://github.com/dzangolab/fastify/compare/v0.55.0...v0.55.1) (2023-12-20)



# [0.55.0](https://github.com/dzangolab/fastify/compare/v0.54.0...v0.55.0) (2023-12-19)


### Features

* add remove device route and multi device notification support ([#575](https://github.com/dzangolab/fastify/issues/575)) ([cadb1ca](https://github.com/dzangolab/fastify/commit/cadb1ca389be99f6106f805b87b787bb0b9077bf))
* **fastify-firebase:** check if app is already initialized before initializing app ([#571](https://github.com/dzangolab/fastify/issues/571)) ([d8ffaad](https://github.com/dzangolab/fastify/commit/d8ffaadc24044946ae14eb55c768a858f19ad3ed))



# [0.54.0](https://github.com/dzangolab/fastify/compare/v0.53.4...v0.54.0) (2023-12-15)


### Features

* add fastify-firebase package for firebase admin utilities ([#566](https://github.com/dzangolab/fastify/issues/566)) ([8131906](https://github.com/dzangolab/fastify/commit/8131906083b575606438aa1ff8ea229d62a4e190))



## [0.53.4](https://github.com/dzangolab/fastify/compare/v0.53.3...v0.53.4) (2023-12-12)


### Bug Fixes

* **multi-tenant:** send email verification to correct email address on signup ([#568](https://github.com/dzangolab/fastify/issues/568)) ([953a6aa](https://github.com/dzangolab/fastify/commit/953a6aace116beb2672dc76ba93ab68cd30b8851))



## [0.53.3](https://github.com/dzangolab/fastify/compare/v0.53.2...v0.53.3) (2023-12-08)


### Bug Fixes

* **multi-tenant:** session valid on tenant app where user is authenticated. ([a6b2286](https://github.com/dzangolab/fastify/commit/a6b2286af846f68c596c022d012e97024bb19739))



## [0.53.2](https://github.com/dzangolab/fastify/compare/v0.53.1...v0.53.2) (2023-11-27)


### Bug Fixes

* close pg client after migration ([10e7384](https://github.com/dzangolab/fastify/commit/10e7384d282084f481c19b9ce3a68d8842f264fd))



## [0.53.1](https://github.com/dzangolab/fastify/compare/v0.53.0...v0.53.1) (2023-11-24)


### Bug Fixes

* **slonik:** support ssl for database connection ([#560](https://github.com/dzangolab/fastify/issues/560)) ([73ed3b5](https://github.com/dzangolab/fastify/commit/73ed3b5926f6a581380128006ac348b7a7efb466))



# [0.53.0](https://github.com/dzangolab/fastify/compare/v0.52.1...v0.53.0) (2023-11-20)

### BREAKING CHANGES

* Multi-tenant: Should Register MigrationPlugin from multi-tenant package to run tenant migrations from app.

Check Readme of @dzangolab/fastify-multi-tenant package.

### Bug Fixes

* **deps:** update dependency pg to v8.11.3 ([#460](https://github.com/dzangolab/fastify/issues/460)) ([e387afb](https://github.com/dzangolab/fastify/commit/e387afb35353fc828d5ff1dc6d3e103bb9a35cea))



## [0.52.1](https://github.com/dzangolab/fastify/compare/v0.52.0...v0.52.1) (2023-11-17)

### Bug Fixes

* **deps:** update dependency slonik to v37.2.0 [security] ([#549](https://github.com/dzangolab/fastify/issues/549)) ([0dfab1b](https://github.com/dzangolab/fastify/commit/0dfab1b05d830d307484ea5be712b4c2e89ecb0e))


# [0.52.0](https://github.com/dzangolab/fastify/compare/v0.51.1...v0.52.0) (2023-11-08)


### Features

* **user:** make supertokens session recipe configurable ([#546](https://github.com/dzangolab/fastify/issues/546)) ([df02111](https://github.com/dzangolab/fastify/commit/df021110c6d93b1f819b661487da4245481d7f52))



## [0.51.1](https://github.com/dzangolab/fastify/compare/v0.51.0...v0.51.1) (2023-11-07)


### Features

* **user:** add user enable and disable graphql resolvers ([#545](https://github.com/dzangolab/fastify/issues/545)) ([1b7d0f8](https://github.com/dzangolab/fastify/commit/1b7d0f818d8b1ac0daeb0a7c7d9190d9f091e7a6))



# [0.51.0](https://github.com/dzangolab/fastify/compare/v0.50.1...v0.51.0) (2023-11-05)


### Features
* **user:** add admin routes to enable/disable user ([#535](https://github.com/dzangolab/fastify/issues/535)) ([b1e3252](https://github.com/dzangolab/fastify/commit/b1e3252ea8e5b9ac1f78c51d1f8fe6d3968066ad))
* **user:** block protected routes to disabled users ([#542](https://github.com/dzangolab/fastify/issues/542)) ([34353d8](https://github.com/dzangolab/fastify/commit/34353d8010aad34cfafd63d14f80367eff1427aa))

### Bug Fixes

* **deps:** update dependency zod to v3.22.3 [security] ([#525](https://github.com/dzangolab/fastify/issues/525)) ([aaf3ac7](https://github.com/dzangolab/fastify/commit/aaf3ac7be3c23b05a7ab2f174116481d580e1836))



## [0.50.1](https://github.com/dzangolab/fastify/compare/v0.50.0...v0.50.1) (2023-10-31)


### Features

* require session to verify email ([#531](https://github.com/dzangolab/fastify/issues/531)) ([6f44f40](https://github.com/dzangolab/fastify/commit/6f44f408b515182e32b1d36d3ddae4edd9b5b4d9))
* **user:** make api and functions configurable of emailVerificationR… ([#533](https://github.com/dzangolab/fastify/issues/533)) ([5efe261](https://github.com/dzangolab/fastify/commit/5efe261f6582b282119ab6566d7692eca56839c4))



# [0.50.0](https://github.com/dzangolab/fastify/compare/v0.49.0...v0.50.0) (2023-10-09)


### Features

* **fastify-user:** add apple redirect handler for android login and multi oauth provider support for apple ([#526](https://github.com/dzangolab/fastify/issues/526)) ([d0e54b3](https://github.com/dzangolab/fastify/commit/d0e54b3f0f51313e05069597b656dacd29e5e2dc))



# [0.49.0](https://github.com/dzangolab/fastify/compare/v0.48.1...v0.49.0) (2023-10-03)


### Features

* **slonik:** Run app migrations through migrationPlugin ([#508](https://github.com/dzangolab/fastify/issues/508)) ([905e25a](https://github.com/dzangolab/fastify/commit/905e25aa71739d5c303c7361886f42a70f07624a))

### BREAKING CHANGES

* Slonik: Should Register MigrationPlugin from slonik package to run app migrations

Check Readme of @dzangolab/fastify-slonik package.


## [0.48.1](https://github.com/dzangolab/fastify/compare/v0.48.0...v0.48.1) (2023-09-26)


### Bug Fixes

* export multipart parser plugin ([#520](https://github.com/dzangolab/fastify/issues/520)) ([fd7e833](https://github.com/dzangolab/fastify/commit/fd7e833521d73f1a4a96ef387317f3bdf11d0245))



# [0.48.0](https://github.com/dzangolab/fastify/compare/v0.47.0...v0.48.0) (2023-09-22)


### Features

* graphql file upload on fastify-s3 ([#509](https://github.com/dzangolab/fastify/issues/509)) ([5d2220f](https://github.com/dzangolab/fastify/commit/5d2220f20feda49bb84e7dd61a305f197547f22b))



# [0.47.0](https://github.com/dzangolab/fastify/compare/v0.46.0...v0.47.0) (2023-09-19)


### Bug Fixes

* fix typo in filename resolution strategy ([#515](https://github.com/dzangolab/fastify/issues/515)) ([cb2a196](https://github.com/dzangolab/fastify/commit/cb2a196caea66746a8192f4132f1940419e1d49e))
* update logic filename suffix to check exact filename ([#516](https://github.com/dzangolab/fastify/issues/516)) ([c1bad9a](https://github.com/dzangolab/fastify/commit/c1bad9a5ce7957a3318c1d788ec1c1f50c7d29f0))


### Features

* update file fields on fastify-s3 ([#512](https://github.com/dzangolab/fastify/issues/512)) ([6e280c4](https://github.com/dzangolab/fastify/commit/6e280c4e460ae9fa3f81ca4f5ef11af088732709))
* **user:** make handlers configurable ([#504](https://github.com/dzangolab/fastify/issues/504)) ([d1e6fb4](https://github.com/dzangolab/fastify/commit/d1e6fb42ec54ab07e691132731eb9fadd5772496))



# [0.46.0](https://github.com/dzangolab/fastify/compare/v0.45.0...v0.46.0) (2023-09-13)


### Bug Fixes

* **user:** fix graphql issue when email not verified for public endpoint ([#493](https://github.com/dzangolab/fastify/issues/493)) ([964e2b4](https://github.com/dzangolab/fastify/commit/964e2b4095a8b760cb06ef87f170b23d06ed6b7e))


### Features

* add delete file method to file service on fastify-s3 ([#501](https://github.com/dzangolab/fastify/issues/501)) ([070f248](https://github.com/dzangolab/fastify/commit/070f248930f77af553d3539418cf836705ae2384))



# [0.45.0](https://github.com/dzangolab/fastify/compare/v0.44.0...v0.45.0) (2023-09-12)


### Features

* add a function to check existing file on s3 bucket ([#496](https://github.com/dzangolab/fastify/issues/496)) ([e6ad3e6](https://github.com/dzangolab/fastify/commit/e6ad3e67368d107cf7ce04ba355ddcf060e5a2d5))



# [0.44.0](https://github.com/dzangolab/fastify/compare/v0.43.0...v0.44.0) (2023-09-04)


### Bug Fixes

* update vite config ([#492](https://github.com/dzangolab/fastify/issues/492)) ([4c87a42](https://github.com/dzangolab/fastify/commit/4c87a42d3846723c100c61f946f65505f59dfe1d))


### Features

* **user:** add ability to auto verify email and send verification email on successful signup ([#489](https://github.com/dzangolab/fastify/issues/489)) ([e49490f](https://github.com/dzangolab/fastify/commit/e49490f0822b1804bf5479d639dbe084c4a4f80d))



# [0.43.0](https://github.com/dzangolab/fastify/compare/v0.42.0...v0.43.0) (2023-09-01)


### Features

* update s3 package config and remove filename from params ([#486](https://github.com/dzangolab/fastify/issues/486)) ([0c076cf](https://github.com/dzangolab/fastify/commit/0c076cf7f6a4990e46f106be3e389eda9e9fff77))
* **user:** add email verification recipe ([#482](https://github.com/dzangolab/fastify/issues/482)) ([3d24b17](https://github.com/dzangolab/fastify/commit/3d24b178b9377675b1c394c3b17ca3d0c79a66a2))
* **user:** remove /auth path for email verification for app ([#487](https://github.com/dzangolab/fastify/issues/487)) ([800189b](https://github.com/dzangolab/fastify/commit/800189b962bb6d6694aabd5b0c7f458edb0aec99))



# [0.42.0](https://github.com/dzangolab/fastify/compare/v0.41.0...v0.42.0) (2023-08-29)


### Features

* **fastify-s3:** add s3 client to get all operation of aws s3 ([#467](https://github.com/dzangolab/fastify/issues/467)) ([391757e](https://github.com/dzangolab/fastify/commit/391757e3813a5c33204ee79853da9b05337e52bd))



# [0.41.0](https://github.com/dzangolab/fastify/compare/v0.40.2...v0.41.0) (2023-08-25)

### BREAKING CHANGES

* Only support supertokens CDI version 2.21 and greater

*  This migration is required when upgrading
```
ALTER TABLE st__session_info ADD COLUMN IF NOT EXISTS use_static_key BOOLEAN NOT NULL DEFAULT(false);
ALTER TABLE st__session_info ALTER COLUMN use_static_key DROP DEFAULT;
```
Check this https://github.com/supertokens/supertokens-node/blob/master/CHANGELOG.md#1400---2023-05-04 to get more info on breaking changes related to supertokens.

## [0.40.2](https://github.com/dzangolab/fastify/compare/v0.40.1...v0.40.2) (2023-08-21)


### Bug Fixes

* remove mailer from fastify request and graphql context ([#474](https://github.com/dzangolab/fastify/issues/474)) ([ebac4a7](https://github.com/dzangolab/fastify/commit/ebac4a784abd8308afa9635c8768f65c404c0a50))



## [0.40.1](https://github.com/dzangolab/fastify/compare/v0.40.0...v0.40.1) (2023-08-18)


### Bug Fixes

* **user:** handle session errors in graphql context ([#470](https://github.com/dzangolab/fastify/issues/470)) ([cd4cf8c](https://github.com/dzangolab/fastify/commit/cd4cf8cfea1f5a6d5b8e63dd2d8b8a3f9ca8f322))



# [0.40.0](https://github.com/dzangolab/fastify/compare/v0.39.1...v0.40.0) (2023-08-17)


### Features

* add plugin on fastify s3 ([#465](https://github.com/dzangolab/fastify/issues/465)) ([d827b0c](https://github.com/dzangolab/fastify/commit/d827b0c3086dd469b05aadef9c3f502b92405ef4))
* added dzangolab/fastify-s3 package ([#464](https://github.com/dzangolab/fastify/issues/464)) ([f1f1e8c](https://github.com/dzangolab/fastify/commit/f1f1e8c2cc49b86ff79ee69c1bbc36e8299913ae))
* **fastify-s3:** add a migration on plugin to create files table ([#466](https://github.com/dzangolab/fastify/issues/466)) ([a416eaf](https://github.com/dzangolab/fastify/commit/a416eafdccde1d4b6314a4d5b0b5496006ad8263))
* **user:** generate invitation link based on app id or request origin ([#446](https://github.com/dzangolab/fastify/issues/446)) ([9824f46](https://github.com/dzangolab/fastify/commit/9824f46282bfdfeb0f826a5258e6f39185fb173a))



## [0.39.1](https://github.com/dzangolab/fastify/compare/v0.39.0...v0.39.1) (2023-08-14)


### Bug Fixes

* **deps:** update dependency eslint-config-turbo to v1.10.12 ([#436](https://github.com/dzangolab/fastify/issues/436)) ([9ef7b0a](https://github.com/dzangolab/fastify/commit/9ef7b0aa772406370ab643331f642bb00a191957))
* **deps:** update dependency nodemailer to v6.9.4 ([#437](https://github.com/dzangolab/fastify/issues/437)) ([0737452](https://github.com/dzangolab/fastify/commit/0737452135465b632d210532cf7a8e144d6879bc))


### Features

* **user:** first admin signup graphql resolver ([#457](https://github.com/dzangolab/fastify/issues/457)) ([aaccbd9](https://github.com/dzangolab/fastify/commit/aaccbd9ad1fbcdc4eec3f5bff5e6ea39c07e69c5))



# [0.39.0](https://github.com/dzangolab/fastify/compare/v0.38.0...v0.39.0) (2023-08-11)


### Features

* **config:** add apps config in apiConfig ([#429](https://github.com/dzangolab/fastify/issues/429)) ([22d7eed](https://github.com/dzangolab/fastify/commit/22d7eedac81d376f710d7cac01fd2ecf299b44bf))



# [0.38.0](https://github.com/dzangolab/fastify/compare/v0.37.1...v0.38.0) (2023-08-09)



## [0.37.1](https://github.com/dzangolab/fastify/compare/v0.37.0...v0.37.1) (2023-08-07)



# [0.37.0](https://github.com/dzangolab/fastify/compare/v0.36.2...v0.37.0) (2023-08-02)


### Bug Fixes

* **slonik:** fix factory getter method in service ([0a4b013](https://github.com/dzangolab/fastify/commit/0a4b0135e890324561df6a744da84922499f62c8))


### Features

* **user:** add post accept invitation config  ([#442](https://github.com/dzangolab/fastify/issues/442)) ([2e8bb39](https://github.com/dzangolab/fastify/commit/2e8bb397bc9ed29f2a3b622a6c632485d78a3714))
* **user:** add User in invitation list method ([#445](https://github.com/dzangolab/fastify/issues/445)) ([44bd832](https://github.com/dzangolab/fastify/commit/44bd832646ec01759c7ac21f0d05cf229c71bb0f))
* **user:** graphql endpoints for invitation ([#440](https://github.com/dzangolab/fastify/issues/440)) ([8d50ab9](https://github.com/dzangolab/fastify/commit/8d50ab9e1314708dbe20daab912198ede4d7c9de))



## [0.36.2](https://github.com/dzangolab/fastify/compare/v0.36.1...v0.36.2) (2023-07-28)


### Performance Improvements

* **user:** remove invitation token in list handler ([#441](https://github.com/dzangolab/fastify/issues/441)) ([c68cb8d](https://github.com/dzangolab/fastify/commit/c68cb8dbfedf11768e020bac74cccf9a3926a14a))



## [0.36.1](https://github.com/dzangolab/fastify/compare/v0.36.0...v0.36.1) (2023-07-25)


### Bug Fixes

* **deps:** update typescript-eslint monorepo to v5.62.0 ([#414](https://github.com/dzangolab/fastify/issues/414)) ([1aa60b1](https://github.com/dzangolab/fastify/commit/1aa60b1623d9ade692a14f47337a1ac209b42698))



# [0.36.0](https://github.com/dzangolab/fastify/compare/v0.35.0...v0.36.0) (2023-07-24)


### Features

* **user:** revoke invitation ([#426](https://github.com/dzangolab/fastify/issues/426)) ([7d14c60](https://github.com/dzangolab/fastify/commit/7d14c601ede5e67e9c8a5bc71b217dbceb3fa243))
* **user:** throw error while create invitation if already have valid invitation in database.  ([#433](https://github.com/dzangolab/fastify/issues/433)) ([c5caa8a](https://github.com/dzangolab/fastify/commit/c5caa8a773d7507069b4b023a0c051dfedae8e82))



# [0.35.0](https://github.com/dzangolab/fastify/compare/v0.34.0...v0.35.0) (2023-07-21)


### Features

* **user:** Add get invitation by token endpoint ([#424](https://github.com/dzangolab/fastify/issues/424)) ([2ff38d2](https://github.com/dzangolab/fastify/commit/2ff38d262eb81f65819028494a72d39b647c3cf6))
* **user:** add list invitatons controller ([#428](https://github.com/dzangolab/fastify/issues/428)) ([2716b29](https://github.com/dzangolab/fastify/commit/2716b2927cadf5b387d6c86d4c447550659f540b))



# [0.34.0](https://github.com/dzangolab/fastify/compare/v0.33.0...v0.34.0) (2023-07-19)


### Features

* **user:** create invitation ([#423](https://github.com/dzangolab/fastify/issues/423)) ([ed8dcab](https://github.com/dzangolab/fastify/commit/ed8dcabeecea54e6ef4c02d81083df8fd7271db6))



# [0.33.0](https://github.com/dzangolab/fastify/compare/v0.32.10...v0.33.0) (2023-06-27)


### Features

* **user:** upgrade supertokens node to 13.6.0 ([#419](https://github.com/dzangolab/fastify/issues/419)) ([c91034a](https://github.com/dzangolab/fastify/commit/c91034adca754baf746ba22132583851e123ce3e))



## [0.32.10](https://github.com/dzangolab/fastify/compare/v0.32.9...v0.32.10) (2023-06-19)


### Bug Fixes

* **deps:** update dependency eslint-config-turbo to v1.10.3 ([#410](https://github.com/dzangolab/fastify/issues/410)) ([e2a8e2a](https://github.com/dzangolab/fastify/commit/e2a8e2aeb17a3d91a7e06c27d7c58495dfabd784))
* **deps:** update dependency nodemailer-mjml to v1.2.24 ([#407](https://github.com/dzangolab/fastify/issues/407)) ([acb8499](https://github.com/dzangolab/fastify/commit/acb849982b32f423f210fb3b65190b156093460c))
* **deps:** update dependency pg to v8.11.0 ([#178](https://github.com/dzangolab/fastify/issues/178)) ([a59d4c0](https://github.com/dzangolab/fastify/commit/a59d4c023fd37c2505a55b5874f70457ed79c861))
* **deps:** update dependency vue-eslint-parser to v9.3.1 ([#412](https://github.com/dzangolab/fastify/issues/412)) ([e2255b5](https://github.com/dzangolab/fastify/commit/e2255b50cc7521d3b399cd108dff397c40d2f4b4))
* **deps:** update typescript-eslint monorepo to v5.59.11 ([#370](https://github.com/dzangolab/fastify/issues/370)) ([614a85d](https://github.com/dzangolab/fastify/commit/614a85dc50c513c00e7f068f136edbaa5f2e403d))



## [0.32.9](https://github.com/dzangolab/fastify/compare/v0.32.8...v0.32.9) (2023-06-15)


### Features

* **slonik:** run package migrations  ([#374](https://github.com/dzangolab/fastify/issues/374)) ([9e45ff0](https://github.com/dzangolab/fastify/commit/9e45ff0381765a6aa851b7486b2f754b9ec180d4))
* **user:** update user details ([#338](https://github.com/dzangolab/fastify/issues/338)) ([eabf0cd](https://github.com/dzangolab/fastify/commit/eabf0cdb4bc2272e5867f70a0daad13410550f05))



## [0.32.8](https://github.com/dzangolab/fastify/compare/v0.32.7...v0.32.8) (2023-06-07)


### Bug Fixes

* **deps:** update dependency nodemailer to v6.9.3 ([#378](https://github.com/dzangolab/fastify/issues/378)) ([ef911d6](https://github.com/dzangolab/fastify/commit/ef911d6b28857f217a43693f0ede9f30acffb5cb))
* **deps:** update dependency nodemailer-mjml to v1.2.22 ([#379](https://github.com/dzangolab/fastify/issues/379)) ([fc809bb](https://github.com/dzangolab/fastify/commit/fc809bb8c8c87f890d10a164c6cb49998fb0a42a))


### Features

* **user:** send reset password success email to user ([#400](https://github.com/dzangolab/fastify/issues/400)) ([4b1d7d7](https://github.com/dzangolab/fastify/commit/4b1d7d7b2acd265bbc1532550933aa5685105377))



## [0.32.7](https://github.com/dzangolab/fastify/compare/v0.32.6...v0.32.7) (2023-06-01)


### Features

* **user:** add role validation for sign up ([#391](https://github.com/dzangolab/fastify/issues/391)) ([dbb15db](https://github.com/dzangolab/fastify/commit/dbb15db4e24fac26abb142a19e4dc2690bc1d080))



## [0.32.6](https://github.com/dzangolab/fastify/compare/v0.32.5...v0.32.6) (2023-05-31)



## [0.32.5](https://github.com/dzangolab/fastify/compare/v0.32.4...v0.32.5) (2023-05-26)


### Bug Fixes

* send email asyncronously ([206c547](https://github.com/dzangolab/fastify/commit/206c547daaf5c7ef77a229a5218f8ba6d4e3ab14))


### Features

* **user:** add roles in users endpoint ([#389](https://github.com/dzangolab/fastify/issues/389)) ([1fe8648](https://github.com/dzangolab/fastify/commit/1fe8648b205800ad678410dc1030fd25ce22de92))
* **user:** export email and password validation from user package ([#392](https://github.com/dzangolab/fastify/issues/392)) ([5c9610f](https://github.com/dzangolab/fastify/commit/5c9610fe3cc8d9de3a48f2e89ee4fa8206f356cb))



## [0.32.4](https://github.com/dzangolab/fastify/compare/v0.32.3...v0.32.4) (2023-05-17)


### Features

* **slonik:** add support camelCase in sort and filter query ([#386](https://github.com/dzangolab/fastify/issues/386)) ([cb0a228](https://github.com/dzangolab/fastify/commit/cb0a228946764d2f7f527eef20d3880d110c22c8))



## [0.32.3](https://github.com/dzangolab/fastify/compare/v0.32.2...v0.32.3) (2023-05-17)


### Features

* **slonik:** Support case for IS NULL and IS NOT NULL in FilterInput ([#383](https://github.com/dzangolab/fastify/issues/383)) ([69936ec](https://github.com/dzangolab/fastify/commit/69936eced4aec2d1b38862b8a78e28cc7456066e))



## [0.32.2](https://github.com/dzangolab/fastify/compare/v0.32.1...v0.32.2) (2023-05-16)


### Bug Fixes

* **deps:** update dependency eslint-config-turbo to v1.9.4 ([#376](https://github.com/dzangolab/fastify/issues/376)) ([d8e302f](https://github.com/dzangolab/fastify/commit/d8e302feb1c8ff692e939d90badcb371fcd6f48d))
* **deps:** update dependency eslint-plugin-unicorn to v46.0.1 ([#362](https://github.com/dzangolab/fastify/issues/362)) ([1c00080](https://github.com/dzangolab/fastify/commit/1c000801d2eafa0b0d16deaf57853830ddeda613))
* **slonik:** fix sorting issue for all and list query ([#377](https://github.com/dzangolab/fastify/issues/377)) ([8443a29](https://github.com/dzangolab/fastify/commit/8443a291b1138666b46b0b516086f1932408f63a))



## [0.32.1](https://github.com/dzangolab/fastify/compare/v0.32.0...v0.32.1) (2023-05-11)


### Bug Fixes

* **multi-tenant:** fix change password issue ([#372](https://github.com/dzangolab/fastify/issues/372)) ([41154df](https://github.com/dzangolab/fastify/commit/41154df9ad7480d99cd6f1e87566eb9cbd5dfa7a))



# [0.32.0](https://github.com/dzangolab/fastify/compare/v0.31.3...v0.32.0) (2023-05-10)


### Features

* Multi tenant authentication ([#355](https://github.com/dzangolab/fastify/issues/355)) ([9b3f6d7](https://github.com/dzangolab/fastify/commit/9b3f6d745e781edf1051e9febf7dc1e2c9e8758e))



## [0.31.3](https://github.com/dzangolab/fastify/compare/v0.31.2...v0.31.3) (2023-05-08)


### Bug Fixes

* **deps:** update dependency nodemailer-mjml to v1.2.18 ([#353](https://github.com/dzangolab/fastify/issues/353)) ([beceef4](https://github.com/dzangolab/fastify/commit/beceef4f42630cf1262249299c616de5f567150a))
* **deps:** update typescript-eslint monorepo to v5.59.2 ([#344](https://github.com/dzangolab/fastify/issues/344)) ([ed3bc26](https://github.com/dzangolab/fastify/commit/ed3bc267d41a1cb5e5e1540a950e2d0121a1aba4))



## [0.31.2](https://github.com/dzangolab/fastify/compare/v0.31.1...v0.31.2) (2023-05-05)

### Features

* **mailer:** decorate mailer in fastify request and graphql context ([#357](https://github.com/dzangolab/fastify/issues/357)) ([5cf086d](https://github.com/dzangolab/fastify/commit/5cf086d3c2f1c4bfa4bcf73bb7517e976503cc12))


## [0.31.1](https://github.com/dzangolab/fastify/compare/v0.31.0...v0.31.1) (2023-04-26)



# [0.31.0](https://github.com/dzangolab/fastify/compare/v0.30.0...v0.31.0) (2023-04-25)


### Bug Fixes

* **deps:** update dependency eslint-config-turbo to v1.9.3 ([#343](https://github.com/dzangolab/fastify/issues/343)) ([8c09e84](https://github.com/dzangolab/fastify/commit/8c09e84144f862a677cbe5ac7b36e3ef871ea8c4))


### Features

* change user profile to user ([#349](https://github.com/dzangolab/fastify/issues/349)) ([9a94d99](https://github.com/dzangolab/fastify/commit/9a94d99de681275c30ae39361cd40dc8ebb65195))

### BREAKING CHANGES

* (user): removed profile and roles from signin and signup auth response.
* (user): added signedUpAt and lastLoginAt property to User 



# [0.30.0](https://github.com/dzangolab/fastify/compare/v0.29.0...v0.30.0) (2023-04-13)


### Bug Fixes

* **deps:** update dependency eslint-config-turbo to v1.9.1 ([#335](https://github.com/dzangolab/fastify/issues/335)) ([37c53d7](https://github.com/dzangolab/fastify/commit/37c53d70531c4a20066badbcf87d49dd8dcce88d))
* **deps:** update typescript-eslint monorepo to v5.58.0 ([#331](https://github.com/dzangolab/fastify/issues/331)) ([79a0e59](https://github.com/dzangolab/fastify/commit/79a0e598b7190469cc630a6a5d7bb462fc0914a1))


### Features

* **slonik:** remove paginatedList ([#305](https://github.com/dzangolab/fastify/issues/305)) ([8757b53](https://github.com/dzangolab/fastify/commit/8757b535d5f9d442a319129ffd87f960c2107657))
* **user:** customizable signUpFeature in supertoken's third party email password recipe ([#332](https://github.com/dzangolab/fastify/issues/332)) ([6241374](https://github.com/dzangolab/fastify/commit/62413743e442f3a344be872fa85f8eca885750e6))



# [0.29.0](https://github.com/dzangolab/fastify/compare/v0.28.0...v0.29.0) (2023-04-12)


### Bug Fixes

* **deps:** update dependency eslint-config-prettier to v8.8.0 ([#315](https://github.com/dzangolab/fastify/issues/315)) ([5d28a05](https://github.com/dzangolab/fastify/commit/5d28a05fd8184b0b4e4773c2b7061d16693f317e))
* **deps:** update dependency eslint-config-turbo to v1 ([#321](https://github.com/dzangolab/fastify/issues/321)) ([fedb91f](https://github.com/dzangolab/fastify/commit/fedb91f2333e2ccb16c19dbc26a090a13f1ff1c9))
* **deps:** update dependency eslint-import-resolver-typescript to v3.5.5 ([#327](https://github.com/dzangolab/fastify/issues/327)) ([f48a187](https://github.com/dzangolab/fastify/commit/f48a187ca133c18aea9cb7ca62e5630891ffdadd))
* **deps:** update dependency eslint-plugin-unicorn to v46 ([#322](https://github.com/dzangolab/fastify/issues/322)) ([f789f2b](https://github.com/dzangolab/fastify/commit/f789f2b134d445958e40ff81033970a7f8846bce))
* **deps:** update dependency nodemailer-mjml to v1.2.15 ([#317](https://github.com/dzangolab/fastify/issues/317)) ([5852d42](https://github.com/dzangolab/fastify/commit/5852d426b0a9bcb8df0de16aa205b594c6b00dd7))


### Features

* **user:** make third party email password recipe functions/apis customizable from user config ([#316](https://github.com/dzangolab/fastify/issues/316)) ([b5fc939](https://github.com/dzangolab/fastify/commit/b5fc939b1fa9476ddfd2583049c3c9639bfdf783))



# [0.28.0](https://github.com/dzangolab/fastify/compare/v0.27.1...v0.28.0) (2023-04-11)

### BREAKING CHANGES

* **user:** remove user object from session token ([#302](https://github.com/dzangolab/fastify/issues/247)) ([c1c0e7f](https://github.com/dzangolab/fastify/commit/c1c0e7f0e6bec30ad45981161ff3e043c7927fc7))

## [0.27.1](https://github.com/dzangolab/fastify/compare/v0.27.0...v0.27.1) (2023-04-05)



# [0.27.0](https://github.com/dzangolab/fastify/compare/v0.26.3...v0.27.0) (2023-04-04)


### Bug Fixes

* **deps:** update dependency vue-eslint-parser to v9.1.1 ([#303](https://github.com/dzangolab/fastify/issues/303)) ([9393642](https://github.com/dzangolab/fastify/commit/9393642432a68fb94fda502b243d44979c301ebc))
* **deps:** update typescript-eslint monorepo to v5.57.1 ([#309](https://github.com/dzangolab/fastify/issues/309)) ([610c03c](https://github.com/dzangolab/fastify/commit/610c03c1af1a0343c98110a64b6baea6c09a4e45))


### BREAKING CHANGES

* **slonik:** update list method of service class ([#302](https://github.com/dzangolab/fastify/issues/302)) ([8f7f83f](https://github.com/dzangolab/fastify/commit/8f7f83ff2ceef73bbc0dc67eb65616821dca70d2))



## [0.26.3](https://github.com/dzangolab/fastify/compare/v0.26.2...v0.26.3) (2023-04-03)


### Bug Fixes

* **deps:** update dependency eslint-import-resolver-typescript to v3.5.4 ([#295](https://github.com/dzangolab/fastify/issues/295)) ([8de8f4b](https://github.com/dzangolab/fastify/commit/8de8f4bad1fe53510afdc96298c1075a9c55a08e))



## [0.26.2](https://github.com/dzangolab/fastify/compare/v0.26.1...v0.26.2) (2023-03-30)


### Bug Fixes

* fix zod validation for getAllSql query ([#294](https://github.com/dzangolab/fastify/issues/294)) ([4d239d0](https://github.com/dzangolab/fastify/commit/4d239d0324386e422c9073997644c46c0cda45d8))



## [0.26.1](https://github.com/dzangolab/fastify/compare/v0.26.0...v0.26.1) (2023-03-29)


### Bug Fixes

* **deps:** update dependency eslint-config-turbo to v0.0.10 ([#287](https://github.com/dzangolab/fastify/issues/287)) ([4ce0514](https://github.com/dzangolab/fastify/commit/4ce0514681f1f25cf6921ed027579a45e03dbf2f))
* **deps:** update dependency html-to-text to v9.0.5 ([#288](https://github.com/dzangolab/fastify/issues/288)) ([878830e](https://github.com/dzangolab/fastify/commit/878830e47422f6aa0e0347270d2edd0d4521ea56))
* **deps:** update dependency nodemailer-mjml to v1.2.13 ([#196](https://github.com/dzangolab/fastify/issues/196)) ([7692ad4](https://github.com/dzangolab/fastify/commit/7692ad4d07da1cf32ce2f18bece6415adef51020))
* **deps:** update typescript-eslint monorepo to v5.57.0 ([#216](https://github.com/dzangolab/fastify/issues/216)) ([ac92830](https://github.com/dzangolab/fastify/commit/ac928305abf39c596d91c4d6d8730b34729f1c7f))
* **user:** return paginated user list on users endpoint ([#283](https://github.com/dzangolab/fastify/issues/283)) ([00954dc](https://github.com/dzangolab/fastify/commit/00954dc681f6a8ecce8f483511967bd3b50d05c8))



# [0.26.0](https://github.com/dzangolab/fastify/compare/v0.25.3...v0.26.0) (2023-03-28)


### Features

* minimize fields in user profile ([#276](https://github.com/dzangolab/fastify/issues/276)) ([5e234c0](https://github.com/dzangolab/fastify/commit/5e234c01f1ae00231fe65445994689508e304b2f))



## [0.25.3](https://github.com/dzangolab/fastify/compare/v0.25.2...v0.25.3) (2023-03-24)


### Bug Fixes

* update password default option and fixed related tests ([041df05](https://github.com/dzangolab/fastify/commit/041df05dee52e7a355fc2e98842220877f1f1e8e))



## [0.25.2](https://github.com/dzangolab/fastify/compare/v0.25.1...v0.25.2) (2023-03-24)


### Bug Fixes

* add user roles to session on signup ([#274](https://github.com/dzangolab/fastify/issues/274)) ([cc3510c](https://github.com/dzangolab/fastify/commit/cc3510c036608746a7244d9a7240f106464376be))



## [0.25.1](https://github.com/dzangolab/fastify/compare/v0.25.0...v0.25.1) (2023-03-23)



# [0.25.0](https://github.com/dzangolab/fastify/compare/v0.24.0...v0.25.0) (2023-03-22)


### Features

* **user:** Email and Password validation customization with config using zod and validator ([#263](https://github.com/dzangolab/fastify/issues/263)) ([41aa997](https://github.com/dzangolab/fastify/commit/41aa997ea3e075fb2192c684e3b09c0d874a4d69))



# [0.24.0](https://github.com/dzangolab/fastify/compare/v0.23.0...v0.24.0) (2023-03-20)

### Features

* **slonik:** upgrade slonik to 33.1.0 ([#259](https://github.com/dzangolab/fastify/issues/260)) ([e1cb147](https://github.com/dzangolab/fastify/commit/e1cb14716f819d2cd3007df2409c947d83842cce))

# [0.23.0](https://github.com/dzangolab/fastify/compare/v0.22.1...v0.23.0) (2023-03-17)


### Features

* **mercurius:** upgrade mercurius to 12.0.([#259](https://github.com/dzangolab/fastify/issues/259)) ([b5ae65c](https://github.com/dzangolab/fastify/commit/b5ae65c3203861fce983153f306a91d864a07489))



## [0.22.1](https://github.com/dzangolab/fastify/compare/v0.22.0...v0.22.1) (2023-03-09)


### Bug Fixes

* **multi-tenant:** fix  getAllWithAliasesSql method ([#254](https://github.com/dzangolab/fastify/issues/254)) ([5a80a25](https://github.com/dzangolab/fastify/commit/5a80a2546a395c79ab33662cbc0bab2bf0156c9c))



# [0.22.0](https://github.com/dzangolab/fastify/compare/v0.21.0...v0.22.0) (2023-03-08)


### Features

* add role config for user plugin ([#251](https://github.com/dzangolab/fastify/issues/251)) ([40a5402](https://github.com/dzangolab/fastify/commit/40a540201ff22cd3bc25617f11021cad14918df5))
* **user:** allow "st-auth-mode" header for auth mode on supertokens ([#243](https://github.com/dzangolab/fastify/issues/243)) ([eecfbae](https://github.com/dzangolab/fastify/commit/eecfbae21fe4051958cbc51fe76bd1629bc2233f))
* **user:** configurable user table name from config ([#250](https://github.com/dzangolab/fastify/issues/250)) ([45e3faa](https://github.com/dzangolab/fastify/commit/45e3faae9c93391078867bc9c1b7de33427fe415))



# [0.21.0](https://github.com/dzangolab/fastify/compare/v0.20.0...v0.21.0) (2023-02-23)


### Features

* add current user route ([#237](https://github.com/dzangolab/fastify/issues/237)) ([aa20d20](https://github.com/dzangolab/fastify/commit/aa20d20ab27493beb40534aab52c9cc06f490ba9))
* **multi-tenant:** multi-tenant tenant-graphql-context ([#239](https://github.com/dzangolab/fastify/issues/239)) ([551f244](https://github.com/dzangolab/fastify/commit/551f24450c06eaaa5ee69edb11a36789986d3b5e))



# [0.20.0](https://github.com/dzangolab/fastify/compare/v0.19.0...v0.20.0) (2023-02-21)


### Features

* skip tenant migration if migration path does not exists([#236](https://github.com/dzangolab/fastify/issues/236)) ([62e2f1a](https://github.com/dzangolab/fastify/commit/62e2f1a7b61001b408575d5346f0766986311895))



# [0.19.0](https://github.com/dzangolab/fastify/compare/v0.18.3...v0.19.0) (2023-02-17)


### Features

* add support in buildContext for updating context based on augmentation from other plugins ([#173](https://github.com/dzangolab/fastify/issues/173)) ([5e013d2](https://github.com/dzangolab/fastify/commit/5e013d2c0b16009096035f5d5460dd3972805859))
* **slonik:** add createDatabase module ([#233](https://github.com/dzangolab/fastify/issues/233)) ([5f30db3](https://github.com/dzangolab/fastify/commit/5f30db3475ab20e0a1aad98ff5ae4647ec50ef5e))



## [0.18.3](https://github.com/dzangolab/fastify/compare/v0.18.2...v0.18.3) (2023-02-16)



## [0.18.2](https://github.com/dzangolab/fastify/compare/v0.18.1...v0.18.2) (2023-02-15)

### Bug Fixes

* **multi-tenent:** fix tenant discovery and getFindByHostnameSql ([#230](https://github.com/dzangolab/fastify/issues/230)) ([0aab1bd](https://github.com/dzangolab/fastify/commit/0aab1bd44fa5c4e398437a423cf2dc02b2e904da))



## [0.18.1](https://github.com/dzangolab/fastify/compare/v0.18.0...v0.18.1) (2023-02-15)


### Bug Fixes

* **multi-tenent:** fix getAliasedField method in sqlFactory ([#226](https://github.com/dzangolab/fastify/issues/226)) ([5e50ff0](https://github.com/dzangolab/fastify/commit/5e50ff0ac5c8de15487062408193b869f9faac14))



# [0.18.0](https://github.com/dzangolab/fastify/compare/v0.17.1...v0.18.0) (2023-02-14)


### Features

* add tests for mailer plugin ([#222](https://github.com/dzangolab/fastify/issues/222)) ([984543d](https://github.com/dzangolab/fastify/commit/984543d648b62e515c1e3df114685245ed44dbee))



## [0.17.1](https://github.com/dzangolab/fastify/compare/v0.17.0...v0.17.1) (2023-02-07)



# [0.17.0](https://github.com/dzangolab/fastify/compare/v0.16.0...v0.17.0) (2023-02-05)



# [0.16.0](https://github.com/dzangolab/fastify/compare/v0.15.2...v0.16.0) (2023-02-05)



## [0.15.2](https://github.com/dzangolab/fastify/compare/v0.15.1...v0.15.2) (2023-02-05)


### Bug Fixes

* **deps:** update typescript-eslint monorepo to v5.50.0 ([#198](https://github.com/dzangolab/fastify/issues/198)) ([7fa5e20](https://github.com/dzangolab/fastify/commit/7fa5e2018f32ba814018046c5630c7d20cfe239f))



## [0.15.1](https://github.com/dzangolab/fastify/compare/v0.15.0...v0.15.1) (2023-02-01)



# [0.15.0](https://github.com/dzangolab/fastify/compare/v0.14.1...v0.15.0) (2023-01-29)


* Config/tests (#185) ([c924ad9](https://github.com/dzangolab/fastify/commit/c924ad9b1644a4742c3912d395756b1f3dc25a37)), closes [#185](https://github.com/dzangolab/fastify/issues/185)
* Slonik/interceptor/camelize result (#184) ([c42649d](https://github.com/dzangolab/fastify/commit/c42649d55b3900fd9d6b0a92c952f97d65905641)), closes [#184](https://github.com/dzangolab/fastify/issues/184)


### BREAKING CHANGES

* SqlFactory arguments have changed.

* fix(multi-tenant): update service factory

* chore(slonik): cleanup configuration

* chore(config): cleanup tsconfig
* SqlFactory arguments have changed.

* fix(multi-tenant): update service factory

* chore(slonik): cleanup configuration



## [0.14.1](https://github.com/dzangolab/fastify/compare/v0.14.0...v0.14.1) (2023-01-28)


### Bug Fixes

* **slonik:** fix config.clientConfiguration ([6ae19b5](https://github.com/dzangolab/fastify/commit/6ae19b5adabc1f3fe34051137ae16db04e5a3ae7))



# [0.14.0](https://github.com/dzangolab/fastify/compare/v0.13.0...v0.14.0) (2023-01-28)


### Bug Fixes

* **deps:** update dependency nodemailer to v6.9.1 ([#157](https://github.com/dzangolab/fastify/issues/157)) ([79b981d](https://github.com/dzangolab/fastify/commit/79b981d55ad0ddf329d4e6725b14141193e975b9))
* **deps:** update dependency nodemailer-mjml to v1.2.4 ([#172](https://github.com/dzangolab/fastify/issues/172)) ([4ae3d0f](https://github.com/dzangolab/fastify/commit/4ae3d0fab6550587001c252038a8d959ccec3f4b))
* **multi-tenant:** slonik.migrations may be undefined ([7df67e5](https://github.com/dzangolab/fastify/commit/7df67e502f52de887f0ebd21112b60745ef55f2e))


### Features

* **slonik:** add default migrations path "migrations" ([#179](https://github.com/dzangolab/fastify/issues/179)) ([7f67036](https://github.com/dzangolab/fastify/commit/7f67036d9b2f89307ec8c4615ed920d06fe4cec1))



# [0.14.0](https://github.com/dzangolab/fastify/compare/v0.13.0...v0.14.0) (2023-01-28)


### Bug Fixes

* **deps:** update dependency nodemailer to v6.9.1 ([#157](https://github.com/dzangolab/fastify/issues/157)) ([79b981d](https://github.com/dzangolab/fastify/commit/79b981d55ad0ddf329d4e6725b14141193e975b9))
* **deps:** update dependency nodemailer-mjml to v1.2.4 ([#172](https://github.com/dzangolab/fastify/issues/172)) ([4ae3d0f](https://github.com/dzangolab/fastify/commit/4ae3d0fab6550587001c252038a8d959ccec3f4b))


### Features

* **slonik:** add default migrations path "migrations" ([#179](https://github.com/dzangolab/fastify/issues/179)) ([7f67036](https://github.com/dzangolab/fastify/commit/7f67036d9b2f89307ec8c4615ed920d06fe4cec1))



# [0.13.0](https://github.com/dzangolab/fastify/compare/v0.12.3...v0.13.0) (2023-01-26)


### Bug Fixes

* **deps:** update dependency eslint-plugin-import to v2.27.5 ([#167](https://github.com/dzangolab/fastify/issues/167)) ([b010b3a](https://github.com/dzangolab/fastify/commit/b010b3a62b963462fff578d52f5a5e6ac7e8d227))
* **deps:** update dependency nodemailer-mjml to v1.2.3 ([#168](https://github.com/dzangolab/fastify/issues/168)) ([93c7614](https://github.com/dzangolab/fastify/commit/93c7614794caca9e9d14d06e161abd5fee96fd55))
* **deps:** update typescript-eslint monorepo to v5.49.0 ([#161](https://github.com/dzangolab/fastify/issues/161)) ([7cef927](https://github.com/dzangolab/fastify/commit/7cef927e36f4635aa7241549ecf9486687e673bc))


### Features

* **slonik:** schema support for sql queries ([#148](https://github.com/dzangolab/fastify/issues/148)) ([67b52fd](https://github.com/dzangolab/fastify/commit/67b52fd3ba3cf10f9c83746baf755645abd7b219))



## [0.12.3](https://github.com/dzangolab/fastify/compare/v0.12.2...v0.12.3) (2023-01-18)


### Bug Fixes

* **slonik:** fix code style ([e7bc58c](https://github.com/dzangolab/fastify/commit/e7bc58c1f493d720042a1df938e7125995b3f989))
* **slonik:** fix code style ([9a7d792](https://github.com/dzangolab/fastify/commit/9a7d792e68543c6ecca1337e1eeb5e4809306618))



## [0.12.2](https://github.com/dzangolab/fastify/compare/v0.12.1...v0.12.2) (2023-01-13)


### Bug Fixes

* **deps:** update dependency eslint-import-resolver-typescript to v3.5.3 ([#147](https://github.com/dzangolab/fastify/issues/147)) ([7cf223a](https://github.com/dzangolab/fastify/commit/7cf223a41c31d16bdd711ea4d87f6bb1bb4d793e))
* **deps:** update dependency eslint-plugin-import to v2.27.4 ([#154](https://github.com/dzangolab/fastify/issues/154)) ([6f57d1f](https://github.com/dzangolab/fastify/commit/6f57d1f75233c2ddb12cefdc70e5477fc4685132))
* **deps:** update typescript-eslint monorepo to v5.48.1 ([#143](https://github.com/dzangolab/fastify/issues/143)) ([44dbbf7](https://github.com/dzangolab/fastify/commit/44dbbf737d4380d5ee64e5d582507646384b570a))
* **slonik:** make minor fixes to slonik package ([#153](https://github.com/dzangolab/fastify/issues/153)) ([1384df6](https://github.com/dzangolab/fastify/commit/1384df6727c5367a4d9b6205252a749df8ff5aba))



## [0.12.1](https://github.com/dzangolab/fastify/compare/v0.12.0...v0.12.1) (2023-01-12)


### Bug Fixes

* **deps:** update dependency eslint-config-prettier to v8.6.0 ([#131](https://github.com/dzangolab/fastify/issues/131)) ([dcf9ea5](https://github.com/dzangolab/fastify/commit/dcf9ea571e6bf9f49834afeb69a7c9ccafa7a995))
* **deps:** update dependency nodemailer-mjml to v1.2.2 ([#138](https://github.com/dzangolab/fastify/issues/138)) ([338379c](https://github.com/dzangolab/fastify/commit/338379cac35d137db7c1334c67397b9db4ebb09f))
* **deps:** update typescript-eslint monorepo to v5.48.0 ([#130](https://github.com/dzangolab/fastify/issues/130)) ([6c4ee5d](https://github.com/dzangolab/fastify/commit/6c4ee5d17cf47a7b3570b747429f311cc5eeff35))


### Performance Improvements

* **fastify-mailer:** Add support for template data from config ([#135](https://github.com/dzangolab/fastify/issues/135)) ([1b442d0](https://github.com/dzangolab/fastify/commit/1b442d0834fca2df097b4ad836e0abbf4a0914a5))



## [0.12.2](https://github.com/dzangolab/fastify/compare/v0.12.1...v0.12.2) (2023-01-13)


### Bug Fixes

* **deps:** update dependency eslint-import-resolver-typescript to v3.5.3 ([#147](https://github.com/dzangolab/fastify/issues/147)) ([7cf223a](https://github.com/dzangolab/fastify/commit/7cf223a41c31d16bdd711ea4d87f6bb1bb4d793e))
* **deps:** update dependency eslint-plugin-import to v2.27.4 ([#154](https://github.com/dzangolab/fastify/issues/154)) ([6f57d1f](https://github.com/dzangolab/fastify/commit/6f57d1f75233c2ddb12cefdc70e5477fc4685132))
* **deps:** update typescript-eslint monorepo to v5.48.1 ([#143](https://github.com/dzangolab/fastify/issues/143)) ([44dbbf7](https://github.com/dzangolab/fastify/commit/44dbbf737d4380d5ee64e5d582507646384b570a))
* **slonik:** make minor fixes to slonik package ([#153](https://github.com/dzangolab/fastify/issues/153)) ([1384df6](https://github.com/dzangolab/fastify/commit/1384df6727c5367a4d9b6205252a749df8ff5aba))



## [0.12.1](https://github.com/dzangolab/fastify/compare/v0.12.0...v0.12.1) (2023-01-12)


### Bug Fixes

* **deps:** update dependency eslint-config-prettier to v8.6.0 ([#131](https://github.com/dzangolab/fastify/issues/131)) ([dcf9ea5](https://github.com/dzangolab/fastify/commit/dcf9ea571e6bf9f49834afeb69a7c9ccafa7a995))
* **deps:** update dependency nodemailer-mjml to v1.2.2 ([#138](https://github.com/dzangolab/fastify/issues/138)) ([338379c](https://github.com/dzangolab/fastify/commit/338379cac35d137db7c1334c67397b9db4ebb09f))
* **deps:** update typescript-eslint monorepo to v5.48.0 ([#130](https://github.com/dzangolab/fastify/issues/130)) ([6c4ee5d](https://github.com/dzangolab/fastify/commit/6c4ee5d17cf47a7b3570b747429f311cc5eeff35))


### Performance Improvements

* **fastify-mailer:** Add support for template data from config ([#135](https://github.com/dzangolab/fastify/issues/135)) ([1b442d0](https://github.com/dzangolab/fastify/commit/1b442d0834fca2df097b4ad836e0abbf4a0914a5))



# [0.12.0](https://github.com/dzangolab/fastify/compare/v0.11.2...v0.12.0) (2022-12-27)


### Features

* add filter and sort on slonik ([#114](https://github.com/dzangolab/fastify/issues/114)) ([7c8b7a6](https://github.com/dzangolab/fastify/commit/7c8b7a647d4192339deaf770c834b55eafdbc133)), closes [#119](https://github.com/dzangolab/fastify/issues/119)



## [0.11.2](https://github.com/dzangolab/fastify/compare/v0.11.1...v0.11.2) (2022-12-27)


### Bug Fixes

* **deps:** update typescript-eslint monorepo to v5.47.1 ([#123](https://github.com/dzangolab/fastify/issues/123)) ([3364c35](https://github.com/dzangolab/fastify/commit/3364c35cad8163af3ce7f357779da0f8462fec6e))



## [0.11.1](https://github.com/dzangolab/fastify/compare/v0.11.0...v0.11.1) (2022-12-25)



# [0.11.0](https://github.com/dzangolab/fastify/compare/v0.10.8...v0.11.0) (2022-12-21)


### Features

* **slonik:** change slonik.migrations config type ([#115](https://github.com/dzangolab/fastify/issues/115)) ([f8b0abf](https://github.com/dzangolab/fastify/commit/f8b0abf4190efbaf168efe275e042810483ee18e))



## [0.10.8](https://github.com/dzangolab/fastify/compare/v0.10.7...v0.10.8) (2022-12-20)


### Bug Fixes

* **deps:** update typescript-eslint monorepo to v5.47.0 ([#112](https://github.com/dzangolab/fastify/issues/112)) ([acb039f](https://github.com/dzangolab/fastify/commit/acb039f53822ddcffc14c70ea786078984c762bf))



## [0.10.7](https://github.com/dzangolab/fastify/compare/v0.10.6...v0.10.7) (2022-12-18)



## [0.10.6](https://github.com/dzangolab/fastify/compare/v0.10.5...v0.10.6) (2022-12-18)



## [0.10.5](https://github.com/dzangolab/fastify/compare/v0.10.4...v0.10.5) (2022-12-18)



## [0.10.4](https://github.com/dzangolab/fastify/compare/v0.10.3...v0.10.4) (2022-12-18)



## [0.10.3](https://github.com/dzangolab/fastify/compare/v0.10.2...v0.10.3) (2022-12-18)



## [0.10.2](https://github.com/dzangolab/fastify/compare/v0.10.1...v0.10.2) (2022-12-18)



## [0.10.1](https://github.com/dzangolab/fastify/compare/v0.10.0...v0.10.1) (2022-12-18)



# [0.10.0](https://github.com/dzangolab/fastify/compare/v0.9.2...v0.10.0) (2022-12-18)


### Features

* **mailer:** add mjml and other plugins to nodemailer ([#101](https://github.com/dzangolab/fastify/issues/101)) ([b0fc6a2](https://github.com/dzangolab/fastify/commit/b0fc6a2af9967147b0465e2d24bf485c409b01df))



## [0.9.2](https://github.com/dzangolab/fastify/compare/v0.9.1...v0.9.2) (2022-12-18)



## [0.9.1](https://github.com/dzangolab/fastify/compare/v0.9.0...v0.9.1) (2022-12-17)



# [0.9.0](https://github.com/dzangolab/fastify/compare/v0.8.6...v0.9.0) (2022-12-17)



## [0.8.6](https://github.com/dzangolab/fastify/compare/v0.8.5...v0.8.6) (2022-12-17)


### Bug Fixes

* **deps:** update dependency eslint-plugin-unicorn to v45.0.2 ([#87](https://github.com/dzangolab/fastify/issues/87)) ([e146ad8](https://github.com/dzangolab/fastify/commit/e146ad8bb4a35cf1f90637e9e1c2743425e27426))
* **deps:** update typescript-eslint monorepo to v5.46.1 ([#75](https://github.com/dzangolab/fastify/issues/75)) ([3573401](https://github.com/dzangolab/fastify/commit/35734018cc443efcdfb7e6ded775393285ff4160))



## [0.8.5](https://github.com/dzangolab/fastify/compare/v0.8.4...v0.8.5) (2022-12-11)



## [0.8.4](https://github.com/dzangolab/fastify/compare/v0.8.3...v0.8.4) (2022-12-11)



## [0.8.3](https://github.com/dzangolab/fastify/compare/v0.8.2...v0.8.3) (2022-12-10)



## [0.8.2](https://github.com/dzangolab/fastify/compare/v0.8.1...v0.8.2) (2022-12-10)



## [0.8.1](https://github.com/dzangolab/fastify/compare/v0.7.0...v0.8.1) (2022-12-10)



# [0.8.0](https://github.com/dzangolab/fastify/compare/v0.7.0...v0.8.0) (2022-12-10)


### Features

* **mercurius:** add fastiify-mercurius plugin ([30aeb19](https://github.com/dzangolab/fastify/commit/30aeb19d2c97a5c7a6af4a15d276c62f4d8fce8a))



# [0.8.0](https://github.com/dzangolab/fastify/compare/v0.7.0...v0.8.0) (2022-12-10)


### Features

* **mercurius:** add fastiify-mercurius plugin ([30aeb19](https://github.com/dzangolab/fastify/commit/30aeb19d2c97a5c7a6af4a15d276c62f4d8fce8a))



# [0.7.0](https://github.com/dzangolab/fastify/compare/v0.6.1...v0.7.0) (2022-12-10)


### Features

* **config:** remove supertokens attribute ([ab65d71](https://github.com/dzangolab/fastify/commit/ab65d71bcbc961b0e9bdd84a3046659d35f1c0db))



## [0.6.1](https://github.com/dzangolab/fastify/compare/v0.6.0...v0.6.1) (2022-12-10)


### Bug Fixes

* **deps:** update typescript-eslint monorepo to v5.46.0 ([#72](https://github.com/dzangolab/fastify/issues/72)) ([d6090cf](https://github.com/dzangolab/fastify/commit/d6090cfc72a9f2a48d83979eb5c845e144918aee))



# [0.6.0](https://github.com/dzangolab/fastify/compare/v0.5.10...v0.6.0) (2022-12-08)


### Features

* **config:** deprecate graphql and graphiql attributes from config ([1710a45](https://github.com/dzangolab/fastify/commit/1710a45a04e0e7e610d59ea38dce887de3d0006a))



## [0.5.10](https://github.com/dzangolab/fastify/compare/v0.5.9...v0.5.10) (2022-12-07)


### Bug Fixes

* **deps:** update typescript-eslint monorepo to v5.45.1 ([#60](https://github.com/dzangolab/fastify/issues/60)) ([1794046](https://github.com/dzangolab/fastify/commit/1794046a473ad5ef64f0b2e0d85ddfe3064d0fdd))



## [0.5.9](https://github.com/dzangolab/fastify/compare/v0.5.8...v0.5.9) (2022-12-07)


### Bug Fixes

* **slonik:** exclude postgres-migrations from build ([9c62397](https://github.com/dzangolab/fastify/commit/9c623976af227a0c49f54185154ad7db97799edb))



## [0.5.8](https://github.com/dzangolab/fastify/compare/v0.5.7...v0.5.8) (2022-12-07)


### Bug Fixes

* **slonik:** make postgres-migrations a peer dependency ([ea6fd38](https://github.com/dzangolab/fastify/commit/ea6fd38e802971b21a02c509f2f012d381f635cd))



## [0.5.7](https://github.com/dzangolab/fastify/compare/v0.5.6...v0.5.7) (2022-12-07)



## [0.5.6](https://github.com/dzangolab/fastify/compare/v0.5.5...v0.5.6) (2022-12-07)



## [0.5.5](https://github.com/dzangolab/fastify/compare/v0.5.4...v0.5.5) (2022-12-07)


### Bug Fixes

* **slonik:** fix migrations path ([cbef31a](https://github.com/dzangolab/fastify/commit/cbef31a271f1b21e3f390e1bd811c2ca60c0ac57))



## [0.5.4](https://github.com/dzangolab/fastify/compare/v0.5.3...v0.5.4) (2022-12-06)


### Bug Fixes

* **slonik:** make fastify-slonik a peer dependency ([ff607ab](https://github.com/dzangolab/fastify/commit/ff607abd34c83ba21a5adf658c958d5284f18903))
* **slonik:** update dependencies ([dd97082](https://github.com/dzangolab/fastify/commit/dd970829a0641179b0ec27f02ed54c3d98fef5f7))



## [0.5.3](https://github.com/dzangolab/fastify/compare/v0.5.2...v0.5.3) (2022-12-04)


### Bug Fixes

* **slonik:** make postgres-migrations a peer dependency ([a720be0](https://github.com/dzangolab/fastify/commit/a720be0ddc82de670717cad182a749be1213b233))



## [0.5.2](https://github.com/dzangolab/fastify/compare/v0.5.1...v0.5.2) (2022-12-04)


### Bug Fixes

* **slonik:** augment fastify types ([fc3cb75](https://github.com/dzangolab/fastify/commit/fc3cb759fbe3cd28557e0d25800a76b0d0b76e5c))



## [0.5.1](https://github.com/dzangolab/fastify/compare/v0.3.2...v0.5.1) (2022-12-04)



# [0.5.0](https://github.com/dzangolab/fastify/compare/v0.4.0...v0.5.0) (2022-12-03)


### Features

* **slonik:** add fastify-slonik plugin ([#43](https://github.com/dzangolab/fastify/issues/43)) ([2da5b09](https://github.com/dzangolab/fastify/commit/2da5b09dfc1b67b802c22b573e2e1d9208586c4e))



# [0.4.0](https://github.com/dzangolab/fastify/compare/v0.3.0...v0.4.0) (2022-12-03)


### Features

* **config:** remove `db` attribute from ApiConfig ([#41](https://github.com/dzangolab/fastify/issues/41)) ([9b1ec37](https://github.com/dzangolab/fastify/commit/9b1ec375b72b166035625f1aa3be9b6581e19e88))



## [0.3.2](https://github.com/dzangolab/fastify/compare/v0.3.1...v0.3.2) (2022-12-04)


### Bug Fixes

* **config:** extract plugin as separate file ([#52](https://github.com/dzangolab/fastify/issues/52)) ([2685ae9](https://github.com/dzangolab/fastify/commit/2685ae96eecc2f1b8e907f2bd432db43b2404344))



## [0.3.1](https://github.com/dzangolab/fastify/compare/v0.2.1...v0.3.1) (2022-12-04)



# [0.3.0](https://github.com/dzangolab/fastify/compare/v0.2.0...v0.3.0) (2022-12-03)



## [0.2.1](https://github.com/dzangolab/fastify/compare/v0.5.0...v0.2.1) (2022-12-04)


### Bug Fixes

* **config:** fix export of ApiConfig type ([39ec736](https://github.com/dzangolab/fastify/commit/39ec73655d0fab488b33a8e8b9365d58b100dd9b))



# [0.5.0](https://github.com/dzangolab/fastify/compare/v0.4.0...v0.5.0) (2022-12-03)


### Features

* **slonik:** add fastify-slonik plugin ([#43](https://github.com/dzangolab/fastify/issues/43)) ([2da5b09](https://github.com/dzangolab/fastify/commit/2da5b09dfc1b67b802c22b573e2e1d9208586c4e))



# [0.4.0](https://github.com/dzangolab/fastify/compare/v0.3.0...v0.4.0) (2022-12-03)


### Features

* **config:** remove `db` attribute from ApiConfig ([#41](https://github.com/dzangolab/fastify/issues/41)) ([9b1ec37](https://github.com/dzangolab/fastify/commit/9b1ec375b72b166035625f1aa3be9b6581e19e88))


## [0.3.3](https://github.com/dzangolab/fastify/compare/v0.3.2...v0.3.3) (2022-12-04)



### Bug Fixes

* **config:** extract plugin as separate file ([#52](https://github.com/dzangolab/fastify/issues/52)) ([2685ae9](https://github.com/dzangolab/fastify/commit/2685ae96eecc2f1b8e907f2bd432db43b2404344))



## [0.3.1](https://github.com/dzangolab/fastify/compare/v0.3.0...v0.3.1) (2022-12-04)


### Bug Fixes

* **config:** fix export of ApiConfig type ([39ec736](https://github.com/dzangolab/fastify/commit/39ec73655d0fab488b33a8e8b9365d58b100dd9b))



# [0.3.0](https://github.com/dzangolab/fastify/compare/v0.2.0...v0.3.0) (2022-12-03)

### Features

* **config:** add parse function ([#39](https://github.com/dzangolab/fastify/issues/39)) ([907d8b4b](https://github.com/dzangolab/fastify/commit/907d84b013559064df2205d3f0f3956398c4b37b))

* **config:** add parse function ([#38](https://github.com/dzangolab/fastify/issues/38)) ([a56a50ee](https://github.com/dzangolab/fastify/commit/a56a50ee01d96011916677a01e648980b02ec2b3))


## [0.2.1](https://github.com/dzangolab/fastify/compare/v0.2.0...v0.2.1) (2022-12-04)


### Bug Fixes

* **config:** fix export of ApiConfig type ([39ec736](https://github.com/dzangolab/fastify/commit/39ec73655d0fab488b33a8e8b9365d58b100dd9b))



# [0.2.0](https://github.com/dzangolab/fastify/compare/v0.1.0...v0.2.0) (2022-12-02)


### Features

* **config:** remove logLevel attribute ([#35](https://github.com/dzangolab/fastify/issues/35)) ([6070617](https://github.com/dzangolab/fastify/commit/6070617fea8e235cfcdb974d6826490f9f7b62a5))



# [0.1.0](https://github.com/dzangolab/fastify/compare/v0.0.14...v0.1.0) (2022-12-02)


### Bug Fixes

* **deps:** update dependency eslint-config-turbo to v0.0.7 ([#32](https://github.com/dzangolab/fastify/issues/32)) ([cba3607](https://github.com/dzangolab/fastify/commit/cba360747ddea0258c3a910569d1a9b5d8dc07f2))
* **deps:** update dependency eslint-plugin-unicorn to v45.0.1 ([#29](https://github.com/dzangolab/fastify/issues/29)) ([1216519](https://github.com/dzangolab/fastify/commit/1216519ae00866b58ed5037cbedad04fd15a43cc))
* **deps:** update typescript-eslint monorepo to v5.45.0 ([#30](https://github.com/dzangolab/fastify/issues/30)) ([0b41dc0](https://github.com/dzangolab/fastify/commit/0b41dc0299e1d4660fe46470fa2decf7033d98f2))



## [0.0.14](https://github.com/dzangolab/fastify/compare/v0.0.13...v0.0.14) (2022-11-26)



## [0.0.13](https://github.com/dzangolab/fastify/compare/v0.0.12...v0.0.13) (2022-11-26)



## [0.0.12](https://github.com/dzangolab/fastify/compare/v0.0.11...v0.0.12) (2022-11-26)



## [0.0.11](https://github.com/dzangolab/fastify/compare/v0.0.10...v0.0.11) (2022-11-26)



## [0.0.10](https://github.com/dzangolab/fastify/compare/v0.0.9...v0.0.10) (2022-11-26)


### Bug Fixes

* **deps:** update dependency eslint-plugin-unicorn to v45 ([#22](https://github.com/dzangolab/fastify/issues/22)) ([0ef20bd](https://github.com/dzangolab/fastify/commit/0ef20bd8fcc85aeef05b4ba345c5c349263e29e9))
* **deps:** update dependency eslint-plugin-vue to v9.8.0 ([#19](https://github.com/dzangolab/fastify/issues/19)) ([cac06ea](https://github.com/dzangolab/fastify/commit/cac06ea2860e0294a48bbd9d493dc8f1b7e54c4c))
* **deps:** update typescript-eslint monorepo to v5.44.0 ([#20](https://github.com/dzangolab/fastify/issues/20)) ([6a9a579](https://github.com/dzangolab/fastify/commit/6a9a579e3b241515d46a4c2e7a40de6e88999317))



## [0.0.9](https://github.com/dzangolab/fastify/compare/v0.0.6...v0.0.9) (2022-11-25)



## [0.0.8](https://github.com/dzangolab/fastify/compare/v0.0.6...v0.0.8) (2022-11-25)



## [0.0.7](https://github.com/dzangolab/fastify/compare/v0.0.6...v0.0.7) (2022-11-25)



## 0.0.6 (2022-11-24)



## 0.0.5 (2022-11-24)
