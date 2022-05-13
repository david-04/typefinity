#-----------------------------------------------------------------------------------------------------------------------
# This Makefile requires GNU Make
#-----------------------------------------------------------------------------------------------------------------------

.SILENT :

TS=$(wildcard $(patsubst %,src/%.ts, * */* */*/* */*/*/* */*/*/*/* */*/*/*/*/* */*/*/*/*/*/* */*/*/*/*/*/*/*))
JS=$(patsubst src/%.ts, build/tsc/%.js, $(TS))
BUNDLE=$(patsubst %, build/webpack/index.%, d.ts js js.map)

#-----------------------------------------------------------------------------------------------------------------------
# Phony targets
#-----------------------------------------------------------------------------------------------------------------------

.PHONY: clean package run tsc webpack

CLEAN_DESCRIPTION=remove the build directory
PACKAGE_DESCRIPTION=create the NPM package
RUN_DESCRIPTION=run the playground module
TSC_DESCRIPTION=compile sources via tsc
WEBPACK_DESCRIPTION=bundle library via webpack

autorun : help;

help :
	$(info )
	$(info $()  clean ..... $(CLEAN_DESCRIPTION))
	$(info $()  package ... $(PACKAGE_DESCRIPTION))
	$(info $()  run ....... $(RUN_DESCRIPTION))
	$(info $()  tsc ....... $(TSC_DESCRIPTION))
	$(info $()  webpack ... $(WEBPACK_DESCRIPTION))

#-----------------------------------------------------------------------------------------------------------------------
# Compile TypeScript via TSC
#-----------------------------------------------------------------------------------------------------------------------

TSC_TIMESTAMP_FILE=build/tsc/timestamp.tmp

compile tsc: $(TSC_TIMESTAMP_FILE);

$(TSC_TIMESTAMP_FILE) : $(TS) src/tsconfig.json Makefile
	echo Compiling... \
		&& tsc -p src/tsconfig.json \
		&& touch $@

#-----------------------------------------------------------------------------------------------------------------------
# Run the playground module
#-----------------------------------------------------------------------------------------------------------------------

run : $(TSC_TIMESTAMP_FILE)
	node --enable-source-maps build/tsc/playground.js

#-----------------------------------------------------------------------------------------------------------------------
# Webpack
#-----------------------------------------------------------------------------------------------------------------------

WEBPACK_TIMESTAMP_FILE=build/webpack/timestamp.tmp

wp webpack : $(WEBPACK_TIMESTAMP_FILE);

$(WEBPACK_TIMESTAMP_FILE) : $(TSC_TIMESTAMP_FILE) webpack.config.js Makefile
	echo Bundling... \
		&& webpack \
		&& sed 's|webpack:///./src/library/|./src/|g' build/webpack/index.js.map.tmp \
		   > build/webpack/index.js.map \
		&& rm build/webpack/index.js.map.tmp \
		&& touch $(WEBPACK_TIMESTAMP_FILE)

#-----------------------------------------------------------------------------------------------------------------------
# Package
#-----------------------------------------------------------------------------------------------------------------------

EXCLUDED_SOURCES=*.json playground.ts
EXCLUDE_OPTIONS=$(foreach pattern, $(EXCLUDED_SOURCES), "--exclude=$(pattern)" )

package : $(WEBPACK_TIMESTAMP_FILE)
	echo Packaging... \
		&& mkdir -p package \
		&& cp -f build/webpack/index.* package/ \
		&& rm -rf package/src \
		&& mkdir -p package/src \
		&& rsync -r -m -p -A $(EXCLUDE_OPTIONS) src/library/ package/src

#-----------------------------------------------------------------------------------------------------------------------
# Cleanup
#-----------------------------------------------------------------------------------------------------------------------

clean :
    #ifneq "$(wildcard build)" ""
	rm -rf build
    #endif
