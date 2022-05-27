#-----------------------------------------------------------------------------------------------------------------------
# This Makefile requires GNU Make
#-----------------------------------------------------------------------------------------------------------------------

.SILENT :

SOURCES=$(wildcard $(patsubst %,src/%, * */* */*/* */*/*/* */*/*/*/* */*/*/*/*/* */*/*/*/*/*/* */*/*/*/*/*/*/*))

#-----------------------------------------------------------------------------------------------------------------------
# Phony targets
#-----------------------------------------------------------------------------------------------------------------------

.PHONY: clean doc docs package run tsc webpack typedoc

CLEAN_DESCRIPTION=remove the build directory
PACKAGE_DESCRIPTION=create the NPM package
PREPROCESS_DESCRIPTION=generate preprocessed/reformatted sources
RUN_DESCRIPTION=run the playground module
TSC_DESCRIPTION=compile sources via tsc
TYPEDOC_DESCRIPTION=create the API documentation
WEBPACK_DESCRIPTION=bundle library via webpack

autorun : help;

help :
	$(info )
	$(info $()  clean ........ $(CLEAN_DESCRIPTION))
	$(info $()  package ...... $(PACKAGE_DESCRIPTION))
	$(info $()  preprocess ... $(PREPROCESS_DESCRIPTION))
	$(info $()  run .......... $(RUN_DESCRIPTION))
	$(info $()  tsc .......... $(TSC_DESCRIPTION))
	$(info $()  typedoc ...... $(TYPEDOC_DESCRIPTION))
	$(info $()  webpack ...... $(WEBPACK_DESCRIPTION))

#-----------------------------------------------------------------------------------------------------------------------
# Compile
#-----------------------------------------------------------------------------------------------------------------------

TSC_TIMESTAMP_FILE=build/tsc/timestamp.tmp

compile tsc: $(TSC_TIMESTAMP_FILE);

$(TSC_TIMESTAMP_FILE) : $(SOURCES) Makefile
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
	echo Bundling... \
		&& webpack \
		&& sed 's|webpack:///./build/preprocess/library/|./src/|g' build/webpack/index.js.map.tmp \
		   > build/webpack/index.js.map \
		&& rm build/webpack/index.js.map.tmp \
		&& node --enable-source-maps build/tsc/scripts/build/modify-declaration.js build/webpack/index.d.ts \
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
		&& rsync -r -m -p -A $(EXCLUDE_OPTIONS) src/library/ package/src \
		&& mkdir -p $@/.. \
		&& touch $@

#-----------------------------------------------------------------------------------------------------------------------
# Documentation
#-----------------------------------------------------------------------------------------------------------------------

TYPEDOC_TIMESTAMP_FILE=build/typedoc/timestamp.tmp

typedoc docs doc : $(TYPEDOC_TIMESTAMP_FILE)

$(TYPEDOC_TIMESTAMP_FILE) : $(PREPROCESS_TIMESTAMP_FILE)
	echo Documenting... \
		&& mkdir -p build/typedoc \
		&& typedoc --out build/typedoc \
				   --tsconfig build/preprocess/tsconfig.json \
				   --name typefinity \
				   --githubPages false \
				   --gitRemote https://github.com/david-04/typefinity.git \
				   --excludePrivate \
				   --excludeProtected \
				   --sort static-first \
				   --sort alphabetical \
				   --internalNamespace tft \
				   build/preprocess/library/export.ts \
		&& touch $@


#-----------------------------------------------------------------------------------------------------------------------
# Cleanup
#-----------------------------------------------------------------------------------------------------------------------

clean :
    #ifneq "$(wildcard build)" ""
	rm -rf build
    #endif


#-----------------------------------------------------------------------------------------------------------------------
# Run the playground module
#-----------------------------------------------------------------------------------------------------------------------

run : $(TSC_TIMESTAMP_FILE)
	node --enable-source-maps build/tsc/playground.js

#-----------------------------------------------------------------------------------------------------------------------
# Run the tests
#-----------------------------------------------------------------------------------------------------------------------

# TODO
