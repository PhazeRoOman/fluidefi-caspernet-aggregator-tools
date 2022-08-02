## FLUIDEFI Caspernet Aggregator Tools

### Description

Classes and types for Casper Network data aggregation tools.

### Installation

Install the package with:

```
npm install fl-casper-tools
```

### Usage

- todo

### Contributing

Developers must follow the [git-flow branching model](https://nvie.com/posts/a-successful-git-branching-model/) when contributing to this project and versioning must adhere to [Semantic Versioning](http://semver.org/).

#### Features

Feature branches must be forked from develop and merged back into develop.

Use the following commands to start a feature:

```
git checkout develop
git pull origin develop
git checkout -b feature/feature_name
```

Once you start pushing commits, open a PR with your branch. The title for your PR should be:

```
feature: feature_name
```

When you are ready, request review for your feature PR on Github's UI, and approval + conversation resolution is required before the branch can be merged.

Merge your feature back into develop with the following:

```
git checkout develop
git merge --no-ff feature_name
git branch -d feature_name
git push origin develop
```

#### Releases

Release branches must be forked from develop and merged into main and develop.

After your feature has been approved and merged into the develop branch, start the release with the following commands:

```
git checkout develop
git pull origin develop
git checkout -b release/x.y.0
```

Create a PR for your release with the title:

```
release: x.y.0
```

and description that matches the entry as it will appear in the changelog:

```
## Release x.y.0
### Added:
 - my new great feature
### Changed:
 - something that needed to be improved
```

Update the changelog and bump the version in package.json to x.y.0. Fix any bugs that may be found in the release branch.

Request review for your PR on Github. Once approved, merge your release branch into main and tag:

```
git checkout main
git pull origin main
git merge --no-ff release/x.y.0
git tag -a 1.2
```

Then merge the release branch into develop:

```
git checkout develop
git pull origin develop
git merge --no-ff release/x.y.0
git branch -d release/x.y.0
```

Once merged, a new version of the package will be published to npm by admin.

#### Hotfixes

Hotfix branches must be forked from main and merged into main and develop.

Start a hotfix with the following commands:

```
git checkout main
git pull origin main
git checkout -b hotfix/hotfix_name
```

Create a PR for your hotfix with the title:

```
hotfix: hotfix_name
```

Make sure to update the changelog and bump the version in package.json.  Request review when ready to merge.

Merge the hotfix into main:

```
git checkout main
git pull origin main
git merge --no-ff hotfix/hotfix_name
git tag -a x.y.z
```

Then merge the hotfix into develop:

```
git checkout develop
git pull origin develop
git merge --no-ff hotfix/hotfix_name
git branch -d hotfix/hotfix_name
```

Once merged, a new version of the package will be published to npm by admin.
