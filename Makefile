#-----------------------------------------------------------------------------------------------------------------------
# This Makefile requires GNU Make
#-----------------------------------------------------------------------------------------------------------------------

.SILENT :

#-----------------------------------------------------------------------------------------------------------------------
# Version numbers and copyright years
#-----------------------------------------------------------------------------------------------------------------------

TYPEFINITY_VERSION=$(shell grep -E "^## \[[0-9.]+\]" CHANGELOG.md | head -1 | sed "s|^\#\# \[||;s|\].*||")
BRACKET=(
COPYRIGHT_FROM=$(shell grep -E "^## \[[0-9.]+\]" CHANGELOG.md | tail -1 | sed "s|.*$(BRACKET)||;s|-.*||")
COPYRIGHT_UNITL=$(shell grep -E "^## \[[0-9.]+\]" CHANGELOG.md | head -1 | sed "s|.*$(BRACKET)||;s|-.*||")
ifeq "$(COPYRIGHT_FROM)" "$(COPYRIGHT_UNITL)"
COPYRIGHT_YEARS=$(COPYRIGHT_FROM)
else
COPYRIGHT_YEARS=$(COPYRIGHT_FROM)-$(COPYRIGHT_UNITL)
endif
NODE_VERSION=$(shell node --version | sed 's|^v||;s|\..*||')
ifneq "$(NODE_VERSION)" "$(shell grep -E '^## \[[0-9.]+\]' CHANGELOG.md | head -1 | sed 's|^## \[||;s|\..*||;')"
$(error Please update the major version number in CHANGELOG.md to $(NODE_VERSION) and run "make uplift")
endif

#-----------------------------------------------------------------------------------------------------------------------
# Phony targets
#-----------------------------------------------------------------------------------------------------------------------

.PHONY: bundle clean compile doc docs help package preprocess release run tsc test uplift webpack typedoc

CLEAN_DESCRIPTION=remove the build directory
PACKAGE_DESCRIPTION=create the NPM package
PREPROCESS_DESCRIPTION=generate preprocessed/reformatted sources
RELEASE_DESCRIPTION=create a release
RUN_DESCRIPTION=run the playground module
TSC_DESCRIPTION=compile sources via tsc
TYPEDOC_DESCRIPTION=create the API documentation
UPLIFT_DESCRIPTION=upgrade to the lasted Node version
WEBPACK_DESCRIPTION=bundle library via webpack

autorun : help;

help :
	$(info )
	$(info $()  clean ........ $(CLEAN_DESCRIPTION))
	$(info $()  package ...... $(PACKAGE_DESCRIPTION))
	$(info $()  preprocess ... $(PREPROCESS_DESCRIPTION))
	$(info $()  release ...... $(RELEASE_DESCRIPTION))
	$(info $()  run .......... $(RUN_DESCRIPTION))
	$(info $()  tsc .......... $(TSC_DESCRIPTION))
	$(info $()  typedoc ...... $(TYPEDOC_DESCRIPTION))
	$(info $()  uplift ....... $(UPLIFT_DESCRIPTION))
	$(info $()  webpack ...... $(WEBPACK_DESCRIPTION))

#-----------------------------------------------------------------------------------------------------------------------
# Resources
#-----------------------------------------------------------------------------------------------------------------------

CURLY_BRACKET={

src/scripts/package/resources.ts : $(wildcard src/scripts/package/resources/*)
	echo Bundling resources... \
		&& rm -f $@ \
		&& touch $@ \
		$(foreach file, $^, \
			&& echo $(file) | sed -E 's|.*/resources/||;s/[^a-zA-Z0-9]+/_/g;s/^/export const /;s/$$/ = `/' >> $@ \
			&& sed 's/\\/\\\\/g;s/\$$$(CURLY_BRACKET)/\\$$$(CURLY_BRACKET)/g' $(file) >> $@ \
			&& echo '`;' >> $@ \
			&& echo "" >> $@ \
		)

#-----------------------------------------------------------------------------------------------------------------------
# Compile
#-----------------------------------------------------------------------------------------------------------------------

TSC_TIMESTAMP_FILE=build/tsc/timestamp.tmp

compile tsc: $(TSC_TIMESTAMP_FILE);

$(TSC_TIMESTAMP_FILE) : Makefile $(wildcard $(patsubst %,src/%, * */* */*/* */*/*/* */*/*/*/* */*/*/*/*/* */*/*/*/*/*/* */*/*/*/*/*/*/*))
	echo Compiling... \
		&& tsc -p src/tsconfig.json \
		&& touch $@

#-----------------------------------------------------------------------------------------------------------------------
# Preprocess
#-----------------------------------------------------------------------------------------------------------------------

PREPROCESS_TIMESTAMP_FILE=build/preprocess/timestamp.tmp

preprocess: $(PREPROCESS_TIMESTAMP_FILE);

$(PREPROCESS_TIMESTAMP_FILE) : $(TSC_TIMESTAMP_FILE)
	echo Preprocessing... \
		&& node --enable-source-maps build/tsc/scripts/build/preprocess-sources.js src build/preprocess \
		&& touch $@

#-----------------------------------------------------------------------------------------------------------------------
# Webpack
#-----------------------------------------------------------------------------------------------------------------------

WEBPACK_TIMESTAMP_FILE=build/webpack/timestamp.tmp

webpack bundle : $(WEBPACK_TIMESTAMP_FILE);

$(WEBPACK_TIMESTAMP_FILE) : $(PREPROCESS_TIMESTAMP_FILE) webpack.config.js Makefile
	echo Bundling declarations... \
		&& webpack --entry ./build/preprocess/library/export.ts --stats errors-only \
		&& sed 's|webpack:///./build/preprocess/library/|./src/|g' build/webpack/index.js.map.tmp \
		   > build/webpack/index.js.map \
		&& rm build/webpack/index.js.map.tmp \
		&& node --enable-source-maps build/tsc/scripts/build/modify-declaration.js build/webpack/index.d.ts \
		&& echo Bundling source... \
		&& webpack --entry ./src/library/export.ts --stats errors-only \
		&& touch $@

#-----------------------------------------------------------------------------------------------------------------------
# Package
#-----------------------------------------------------------------------------------------------------------------------

EXCLUDED_SOURCES=*.json playground.ts
EXCLUDE_OPTIONS=$(foreach pattern, $(EXCLUDED_SOURCES), "--exclude=$(pattern)" )

PACKAGE_TIMESTAMP_FILE=build/package/timestamp.tmp

package : $(PACKAGE_TIMESTAMP_FILE);

$(PACKAGE_TIMESTAMP_FILE) : $(WEBPACK_TIMESTAMP_FILE)
	echo Packaging... \
		&& mkdir -p package \
		&& cp -f build/webpack/index.js package/ \
		&& cp -f build/webpack/index-module.d.ts package/index.d.ts \
		&& cp -f build/webpack/index-global.d.ts package/global/index.d.ts \
		&& rm -rf package/src \
		&& mkdir -p package/src \
		&& rsync -r -m -p -A --delete --delete-excluded $(EXCLUDE_OPTIONS) src/library/ package/src \
		&& rsync -r -m -p -A --delete --delete-excluded --exclude=*.d.ts build/tsc/scripts/package/ package/scripts \
		&& mkdir -p $@/.. \
		&& touch $@

#-----------------------------------------------------------------------------------------------------------------------
# Documentation
#-----------------------------------------------------------------------------------------------------------------------

TYPEDOC_TIMESTAMP_FILE=build/typedoc/timestamp.tmp

typedoc docs doc : $(TYPEDOC_TIMESTAMP_FILE)

$(TYPEDOC_TIMESTAMP_FILE) : $(WEBPACK_TIMESTAMP_FILE)
	echo Documenting... \
		&& rm -rf build/typedoc \
		&& mkdir -p build/typedoc \
		&& cp build/preprocess/tsconfig.json build/typedoc/ \
		&& cp build/webpack/index-module.d.ts build/typedoc/typedoc.ts \
		&& typedoc --out build/typedoc \
				   --tsconfig build/preprocess/tsconfig.json \
				   --name typefinity \
				   --githubPages false \
				   --gitRemote https://github.com/david-04/typefinity.git \
				   --excludePrivate \
				   --excludeProtected \
				   --excludeExternals \
				   --sort static-first \
				   --sort alphabetical \
				   --disableSources \
				   --hideGenerator \
				   --logLevel Warn \
				   --treatWarningsAsErrors \
				   --cleanOutputDir false \
				   --tsconfig build/typedoc/tsconfig.json \
				   build/typedoc/typedoc.ts \
		&& rm -f build/typedoc/tsconfig.json build/typedoc/typedoc.ts \
		&& touch $@

#-----------------------------------------------------------------------------------------------------------------------
# Uplift
#-----------------------------------------------------------------------------------------------------------------------

uplift :
	echo Updating dependencies... \
		&& mkdir -p build \
		&& cat package.json \
			| sed 's|"@types/node": "[^"]*"|"@types/node": "^$(NODE_VERSION)"|' \
			> build.package.json.tmp \
		&& mv -f build.package.json.tmp package.json \
		&& cat package/package.json \
			| sed 's|"@types/node": "[^"]*"|"@types/node": "^$(NODE_VERSION)"|' \
			> build.package.json.tmp \
		&& mv -f build.package.json.tmp package/package.json \
		&& npm update \
		&& make --silent --no-print-directory update-metadata

#-----------------------------------------------------------------------------------------------------------------------
# Release
#-----------------------------------------------------------------------------------------------------------------------

release : clean update-metadata package;

update-metadata :
	echo Updating version information... \
		&& mkdir -p build \
		&& cat src/scripts/package/version-info.ts \
			| sed 's/.*TYPEFINITY_VERSION.*/export const TYPEFINITY_VERSION = "$(TYPEFINITY_VERSION)";/g' \
			| sed 's/.*COPYRIGHT_YEARS.*/export const COPYRIGHT_YEARS = "$(COPYRIGHT_YEARS)";/g' \
			| sed 's/.*NODE_VERSION.*/export const NODE_VERSION = $(NODE_VERSION);/g' \
			> build/version-info.ts.tmp \
		&& mv -f build/version-info.ts.tmp src/scripts/package/version-info.ts \
		&& cat LICENSE \
			| sed 's/.*David Hofmann.*/Copyright (c) $(COPYRIGHT_YEARS) David Hofmann/' \
			> build/LICENSE.tmp \
		&& mv -f build/LICENSE.tmp LICENSE \
		&& cat package/package.json \
			| sed 's/"version": "[^"]*"/"version": "$(TYPEFINITY_VERSION)"/g' \
			> build/package.json \
		&& mv -f build/package.json package/package.json

#-----------------------------------------------------------------------------------------------------------------------
# Cleanup
#-----------------------------------------------------------------------------------------------------------------------

clean :
    ifneq "$(wildcard build)" ""
	rm -rf build
    endif

#-----------------------------------------------------------------------------------------------------------------------
# Run the playground module
#-----------------------------------------------------------------------------------------------------------------------

run : $(TSC_TIMESTAMP_FILE)
	node --enable-source-maps build/tsc/library/debug.js

#-----------------------------------------------------------------------------------------------------------------------
# Run the tests
#-----------------------------------------------------------------------------------------------------------------------

# TODO
