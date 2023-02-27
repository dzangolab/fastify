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
