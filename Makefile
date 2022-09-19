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
# Utility functions
#-----------------------------------------------------------------------------------------------------------------------

NESTING=* */* */*/* */*/*/* */*/*/*/* */*/*/*/*/* */*/*/*/*/*/* */*/*/*/*/*/*/* */*/*/*/*/*/*/*/* */*/*/*/*/*/*/*/*/*
WILDCARD_NESTED=$(foreach pattern, $(2), $(wildcard \
					$(strip $(1))/$(strip $(pattern)) \
					$(patsubst %, $(strip $(1))/%/$(strip $(pattern)), $(NESTING)) \
				))

#-----------------------------------------------------------------------------------------------------------------------
# Phony targets
#-----------------------------------------------------------------------------------------------------------------------

.PHONY: bundle clean compile doc docs help package release run tsc test uplift webpack typedoc

CLEAN_DESCRIPTION=remove the build directory
PACKAGE_DESCRIPTION=create the NPM package
RELEASE_DESCRIPTION=create a release
RUN_DESCRIPTION=run the playground module
TSC_DESCRIPTION=compile sources via tsc
TYPEDOC_DESCRIPTION=create the API documentation
UPLIFT_DESCRIPTION=upgrade to the lasted Node version
WEBPACK_DESCRIPTION=bundle library via webpack

#-----------------------------------------------------------------------------------------------------------------------
# Help
#-----------------------------------------------------------------------------------------------------------------------

autorun : help;

help :
	$(info )
	$(info $()  clean ........ $(CLEAN_DESCRIPTION))
	$(info $()  package ...... $(PACKAGE_DESCRIPTION))
	$(info $()  release ...... $(RELEASE_DESCRIPTION))
	$(info $()  run .......... $(RUN_DESCRIPTION))
	$(info $()  tsc .......... $(TSC_DESCRIPTION))
	$(info $()  typedoc ...... $(TYPEDOC_DESCRIPTION))
	$(info $()  uplift ....... $(UPLIFT_DESCRIPTION))
	$(info $()  webpack ...... $(WEBPACK_DESCRIPTION))

#-----------------------------------------------------------------------------------------------------------------------
# Codify file templates
#-----------------------------------------------------------------------------------------------------------------------

FILE_TEMPLATES_TS=src/core/resources/file-templates.ts

$(FILE_TEMPLATES_TS) : $(call WILDCARD_NESTED, resources/templates, * .??*)
	echo Updating file templates... \
		&& echo "export const FILE_TEMPLATES = {" > "$@" \
		   $(foreach file, $^, \
				&& echo '    "$(strip $(file))": `' | sed 's|resources/templates/||g;' >> "$@" \
				&& sed -E 's/\\|`|\$$/\\\0/g' "$(file)" >> "$@" \
				&& echo '`.trim() + "\n",' >> "$@" \
		   ) \
		&& echo "} as const;" >> "$@"

#-----------------------------------------------------------------------------------------------------------------------
# Update embedded metadata
#-----------------------------------------------------------------------------------------------------------------------

update-version-number-and-copyright :
	echo Updating version information... \
		&& mkdir -p build/temp \
		&& cat src/core/resources/typefinity-metadata.ts \
			| sed 's/.*TYPEFINITY_VERSION.*/export const TYPEFINITY_VERSION = "$(TYPEFINITY_VERSION)";/g' \
			| sed 's/.*COPYRIGHT_YEARS.*/export const COPYRIGHT_YEARS = "$(COPYRIGHT_YEARS)";/g' \
			| sed 's/.*NODE_VERSION.*/export const NODE_VERSION = $(NODE_VERSION);/g' \
			> build/temp/typefinity-metadata.ts \
		&& mv -f build/temp/typefinity-metadata.ts src/core/resources/typefinity-metadata.ts \
		&& cat LICENSE \
			| sed 's/.*David Hofmann.*/Copyright (c) $(COPYRIGHT_YEARS) David Hofmann/' \
			> build/temp/LICENSE \
		&& mv -f build/temp/LICENSE LICENSE \
		&& cat dist/package.json \
			| sed 's/"version": "[^"]*"/"version": "$(TYPEFINITY_VERSION)"/g' \
			> build/temp/package.json \
		&& mv -f build/temp/package.json dist/package.json

#-----------------------------------------------------------------------------------------------------------------------
# Compile
#-----------------------------------------------------------------------------------------------------------------------

TSC_TIMESTAMP_FILE=build/tsc/timestamp.tmp

compile tsc: $(TSC_TIMESTAMP_FILE);

$(TSC_TIMESTAMP_FILE) : $(call WILDCARD_NESTED, src, *.ts) $(FILE_TEMPLATES_TS)
	echo Compiling... \
		&& tsc -b resources/tsconfig/src/tsconfig.composite-projects.json \
		&& touch $@

#-----------------------------------------------------------------------------------------------------------------------
# Run the tests
#-----------------------------------------------------------------------------------------------------------------------

# TODO

#-----------------------------------------------------------------------------------------------------------------------
# Normalize
#-----------------------------------------------------------------------------------------------------------------------

SRC_TIMESTAMP_FILE=build/src/timestamp.tmp

preprocess : $(SRC_TIMESTAMP_FILE);

$(SRC_TIMESTAMP_FILE) : $(TSC_TIMESTAMP_FILE)
	echo Normalizing sources... \
		&& rm -rf build/tsc \
		&& cp -r src build \
		&& ls -la build/\
		&& node --enable-source-maps build/tsc/scripts/build/normalize-jsdoc-comments.js build/src \
		&& touch $@

#-----------------------------------------------------------------------------------------------------------------------
# Webpack
#-----------------------------------------------------------------------------------------------------------------------

WEBPACK_TIMESTAMP_FILE=build/webpack/timestamp.tmp

webpack bundle : $(WEBPACK_TIMESTAMP_FILE);

WEBPACK=&& echo "Bundling $(strip $(1))..." \
		&& webpack --config "build/tsc/scripts/webpack/webpack.$(strip $(1)).js" \
				   --entry "$(strip $(2))" \
				   --stats errors-only \
		&& sed 's|webpack:///./src/$(strip $(1))/|./src/$(strip $(1))|g' build/webpack/$(strip $(1))/index.js.map \
		   > "build/webpack/$(strip $(1))/index.js.map.tmp" \
		&& mv -f "build/webpack/$(strip $(1))/index.js.map.tmp" "build/webpack/$(strip $(1))/index.js.map" \
		&& node --enable-source-maps \
				"build/tsc/scripts/build/normalize-module-names.js" \
				"$(strip $(1))" \
				"build/webpack/$(strip $(1))/index.d.ts" \
		&& touch $@

$(WEBPACK_TIMESTAMP_FILE) : $(TSC_TIMESTAMP_FILE) Makefile
	echo "Normalizing JsDoc comments..." \
		&& node --enable-source-maps build/tsc/scripts/build/normalize-jsdoc-comments.js build/tsc \
		$(foreach module, core node web, $(call WEBPACK, $(module), ./build/tsc/$(module)/export-$(module).js)) \
		$(call WEBPACK, root, ./build/tsc/export.js) \
		$(call WEBPACK, typefinity-cli, ./build/tsc/scripts/typefinity-cli/typefinity-cli.js)

#-----------------------------------------------------------------------------------------------------------------------
# Package
#-----------------------------------------------------------------------------------------------------------------------

EXCLUDED_SOURCES=*.json debug.ts
EXCLUDE_OPTIONS=$(foreach pattern, $(EXCLUDED_SOURCES), "--exclude=$(pattern)" )

PACKAGE_TIMESTAMP_FILE=build/temp/package-timestamp.tmp

package : $(PACKAGE_TIMESTAMP_FILE);

$(PACKAGE_TIMESTAMP_FILE) : $(WEBPACK_TIMESTAMP_FILE)
	echo Packaging... \
		&& mkdir -p "build/temp" \
		$(foreach module, core node web, \
			&& mkdir -p "dist/$(module)" \
			&& cp -f "build/webpack/$(module)/index.js" "dist/$(module)/index.js" \
			&& cp -f "build/webpack/$(module)/index.js.map" "dist/$(module)/index.js.map" \
			&& cp -f "build/webpack/$(module)/index-module.d.ts" "dist/$(module)/index.d.ts" \
			&& cp -f "build/webpack/$(module)/index-global.d.ts" "dist/$(module)/global/index.d.ts" \
		) \
		&& rm -rf "dist/src" \
		&& find src| grep -vE "^src/debug.ts|^src/tsconfig.json|^src/scripts|\.test\." | zip -@ -9 -q dist/src.zip \
		&& mkdir -p "dist/scripts" \
		&& cp -f "build/webpack/typefinity-cli/index.js" "dist/scripts/typefinity-cli.js" \
		&& cp -f "build/webpack/typefinity-cli/index.js.map" "dist/scripts/typefinity-cli.js.map" \
		&& mkdir -p "$@/.." \
		&& touch "$@"

#-----------------------------------------------------------------------------------------------------------------------
# Documentation
#-----------------------------------------------------------------------------------------------------------------------

TYPEDOC_TIMESTAMP_FILE=build/typedoc/timestamp.tmp

typedoc docs doc : $(TYPEDOC_TIMESTAMP_FILE)

$(TYPEDOC_TIMESTAMP_FILE) : $(WEBPACK_TIMESTAMP_FILE)
	echo Documenting... \
		&& rm -rf build/typedoc \
		&& mkdir -p build/typedoc \
		&& sed 's|"\.\./|"../../|g' src/tsconfig.json > build/typedoc/tsconfig.json \
		&& cp build/webpack/root/index-module.d.ts build/typedoc/typedoc.ts \
		&& typedoc --out build/typedoc \
				   --tsconfig build/typedoc/tsconfig.json \
				   --name typefinity \
				   --githubPages false \
				   --gitRemote https://github.com/david-04/typefinity.git \
				   --excludePrivate \
				   --excludeProtected \
				   --excludeExternals \
				   --excludeInternal \
				   --sort static-first \
				   --sort alphabetical \
				   --disableSources \
				   --hideGenerator \
				   --logLevel Warn \
				   --treatWarningsAsErrors \
				   --cleanOutputDir false \
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

release : clean update-version-number-and-copyright package;

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
	node --enable-source-maps build/tsc/debug.js
