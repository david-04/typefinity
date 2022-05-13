#-----------------------------------------------------------------------------------------------------------------------
# This Makefile requires GNU Make
#-----------------------------------------------------------------------------------------------------------------------

.SILENT :

TS=$(wildcard $(patsubst %,src/%.ts, * */* */*/* */*/*/* */*/*/*/* */*/*/*/*/* */*/*/*/*/*/* */*/*/*/*/*/*/*))
JS=$(patsubst src/%.ts, build/tsc/%.js, $(TS))
BUNDLE=$(patsubst %, build/webpack/typefinity.%, d.ts js js.map)

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

compile tsc: $(JS);

$(JS) : $(TS) src/tsconfig.json
	echo Compiling...
	tsc -p src/tsconfig.json

#-----------------------------------------------------------------------------------------------------------------------
# Run the playground module
#-----------------------------------------------------------------------------------------------------------------------

run : build/tsc/playground.js
	node --enable-source-maps $^

#-----------------------------------------------------------------------------------------------------------------------
# Webpack
#-----------------------------------------------------------------------------------------------------------------------

wp webpack : $(BUNDLE);

$(BUNDLE) : $(JS) src/tsconfig.json webpack.config.js
	echo Bundeling via webpack..\
		&& webpack \
		&& sed 's|webpack:///./src/library/|./src/|g' build/webpack/typefinity.js.map.tmp \
		   > build/webpack/typefinity.js.map \
		&& rm build/webpack/typefinity.js.map.tmp \
		&& touch $(BUNDLE)

#-----------------------------------------------------------------------------------------------------------------------
# Package
#-----------------------------------------------------------------------------------------------------------------------

package : $(BUNDLE) $(JS)
	echo Creating package... \
		&& mkdir -p package \
		$(foreach file, $(BUNDLE), && cp -f $(file) package/) \
		&& mkdir -p package/src \
		&& cp -r src/library/* package/src

#-----------------------------------------------------------------------------------------------------------------------
# Cleanup
#-----------------------------------------------------------------------------------------------------------------------

clean :
    #ifneq "$(wildcard build)" ""
	rm -rf build
    #endif
