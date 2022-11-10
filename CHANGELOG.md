# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

## [0.2.0] - 2022-11-10
### Added
- typeorm entities
- `DataStore` implementation
- `BlockSaver` for saving blocks to the data store
### Changed
- field name `block_height` to `block_number` in `blocks` schema
- error field in most return types from `string` to `any`
- usage examples
### Removed
- all models
- postgres client wrappers

## [0.1.2] - 2022-08-31
### Fixed
- error handling message in `PostgresClient`
### Added
- more documentation

## [0.1.1] - 2022-08-03
### Changed
- classes to receive settings via constructor

## [0.1.0] - 2022-06-06
### Added
- initial project files
