# Changelog

## [1.1.9](https://github.com/ehmpathy/simple-artifact-builder/compare/v1.1.8...v1.1.9) (2023-02-16)


### Bug Fixes

* **audit:** resolve security vulnerabilities with audit fix ([6922142](https://github.com/ehmpathy/simple-artifact-builder/commit/69221424fa586fc9cf93793a0293e96a332ad173))
* **practs:** upgrade to latest declapract-typescript-ehmpathy best practices ([3c3c15e](https://github.com/ehmpathy/simple-artifact-builder/commit/3c3c15e6917c364d8de91c4678bbe2ebf8898d5b))

## [1.1.8](https://github.com/ehmpathy/simple-artifact-builder/compare/v1.1.7...v1.1.8) (2023-02-05)


### Bug Fixes

* **deps:** ensure to bundle the static js executable with dist ([8c5ad03](https://github.com/ehmpathy/simple-artifact-builder/commit/8c5ad03698df08146b82f8938859b490a2d7836b))

## [1.1.7](https://github.com/ehmpathy/simple-artifact-builder/compare/v1.1.6...v1.1.7) (2023-02-05)


### Bug Fixes

* **deps:** bump from uuid@8.3 to unblock npm installs ([de44909](https://github.com/ehmpathy/simple-artifact-builder/commit/de449091d37df21638e5fb8c88b601976d6c896d))

## [1.1.6](https://github.com/ehmpathy/simple-artifact-builder/compare/v1.1.5...v1.1.6) (2022-12-23)


### Bug Fixes

* **pkg:** remove private flag from package description ([a77fef4](https://github.com/ehmpathy/simple-artifact-builder/commit/a77fef4e2a2b4bf97029d59f64acb0c95f883c11))

## [1.1.5](https://github.com/ehmpathy/simple-artifact-builder/compare/v1.1.4...v1.1.5) (2022-12-23)


### Bug Fixes

* **cicd:** specify the node registry to unblock publishing ([5153d15](https://github.com/ehmpathy/simple-artifact-builder/commit/5153d15bc1ca2ca9fffabe6d56ebc274190a05f0))

## [1.1.4](https://github.com/ehmpathy/simple-artifact-builder/compare/v1.1.3...v1.1.4) (2022-12-23)


### Bug Fixes

* **cicd:** ensure lack of acceptance tests doesnt prevent deploy ([d856bd4](https://github.com/ehmpathy/simple-artifact-builder/commit/d856bd4f01232ccef36753caca4c414016fadc10))

## [1.1.3](https://github.com/ehmpathy/simple-artifact-builder/compare/v1.1.2...v1.1.3) (2022-12-23)


### Bug Fixes

* **cicd:** update the please-release action version ([9000f84](https://github.com/ehmpathy/simple-artifact-builder/commit/9000f84eccf6a097c7a80b64647abf02b0cd6fed))
* **cicd:** upgrade github actions config ([dcb71b4](https://github.com/ehmpathy/simple-artifact-builder/commit/dcb71b420b583090ad1f114df6b52834f8ca146d))
* **deps:** upgrade chalk version to resolve coloring snapshot failure in test ([127aa8d](https://github.com/ehmpathy/simple-artifact-builder/commit/127aa8ddbed9b0b7c3f53a8cf62222fee8327f11))
* **deps:** use fs.rm instead of fs.rmdir per deprecation warning ([0fc2505](https://github.com/ehmpathy/simple-artifact-builder/commit/0fc250527ebb4e404fb823986b56af7dc783d684))
* **pkg:** ensure that the distributed simple-artifact-builder package does not include __test_assets__ ([4b6a21f](https://github.com/ehmpathy/simple-artifact-builder/commit/4b6a21f036b50ab7f5009e4d177fa50dcf962c04))
* **pract:** upgrade to use latest declared best practices ([fb2d5ee](https://github.com/ehmpathy/simple-artifact-builder/commit/fb2d5eef668c4a34b953aa07aa85fea47962ef88))
* **refs:** replace uladkasach repo refs to ehmpathy repo refs ([9d3dabe](https://github.com/ehmpathy/simple-artifact-builder/commit/9d3dabe14537afe1753ca016ed7cdfc27f98c859))
* **snapshot:** ensure that ci=true when running jest test so ci snapshot test passes ([82e2642](https://github.com/ehmpathy/simple-artifact-builder/commit/82e2642d845c4ad9c73e9038e61d46fc27643553))
* **test:** drop fs.rmdir in favor of fs.rm per node18 deprecation ([24bac2c](https://github.com/ehmpathy/simple-artifact-builder/commit/24bac2cc911fb817e1ff95a33755ac106e8151bc))

### [1.1.2](https://www.github.com/uladkasach/simple-artifact-builder/compare/v1.1.1...v1.1.2) (2021-11-09)


### Bug Fixes

* **run:** ensure that static assets are included in published pkg ([9938ba7](https://www.github.com/uladkasach/simple-artifact-builder/commit/9938ba7c8bc3d8c0261ba8c294f0d2f0520a624f))

### [1.1.1](https://www.github.com/uladkasach/simple-artifact-builder/compare/v1.1.0...v1.1.1) (2021-11-09)


### Bug Fixes

* **run:** expose the run-isolated utility with every build ([db45488](https://www.github.com/uladkasach/simple-artifact-builder/commit/db45488cdf77a4121ecaa8553b66085300b2dcb6))

## [1.1.0](https://www.github.com/uladkasach/simple-artifact-builder/compare/v1.0.1...v1.1.0) (2021-11-09)


### Features

* **run:** enable executing files inside of artifacts with isolated node module imports for testing ([3dc2190](https://www.github.com/uladkasach/simple-artifact-builder/commit/3dc21900cd94af3cbd9e174114984ff8cd8e82a9))

### [1.0.1](https://www.github.com/uladkasach/simple-artifact-builder/compare/v1.0.0...v1.0.1) (2021-11-04)


### Bug Fixes

* **clean:** clean the artifact dir out before building ([53b493f](https://www.github.com/uladkasach/simple-artifact-builder/commit/53b493f013845abed50c5258479b7326c1ca991e))

## 1.0.0 (2021-11-04)


### Features

* **build:** complete the buildArtifactContents logic ([880cd78](https://www.github.com/uladkasach/simple-artifact-builder/commit/880cd7833a55a283edef4d9b411704c8fb9efc0b))
* **commands:** add the zip command ([014b8d6](https://www.github.com/uladkasach/simple-artifact-builder/commit/014b8d6a520e7c7f01b64d8cac4a2d2a9a205644))
* **init:** initialize based on declapract project ([4182e9e](https://www.github.com/uladkasach/simple-artifact-builder/commit/4182e9e342a4e8c2a140b41f0d4d0ec441fbd05e))
* **report:** enable reporting on sizes of artifact contents ([9baa6a0](https://www.github.com/uladkasach/simple-artifact-builder/commit/9baa6a0b1724fcc425e3cb01a1ddc1dc3bf4b569))
* **zip:** enable zipping of artifact contents ([09adb16](https://www.github.com/uladkasach/simple-artifact-builder/commit/09adb1619d31e1bc609ca7580d6dfdda87c52577))
