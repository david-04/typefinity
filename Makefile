include .launchpad/Makefile.header # see .launchpad/Makefile.documentation

#-----------------------------------------------------------------------------------------------------------------------
# Default target
#-----------------------------------------------------------------------------------------------------------------------

autorun : test;

#-----------------------------------------------------------------------------------------------------------------------
# Run
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target, run, ................ run debug.ts)

run : $(LP_PREREQUISITE_TSC)
	$(call lp.run, build/tsc/debug.js)

#-----------------------------------------------------------------------------------------------------------------------
# Test
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target, test, ............... run the unit tests)

test tests : $(LP_PREREQUISITE_TSC)
	. ./bin/run-tests.sh

#-----------------------------------------------------------------------------------------------------------------------
# Bundle
#-----------------------------------------------------------------------------------------------------------------------

NORMALIZE_JAVADOC=. bin/normalize-javadoc-comments.sh

$(call lp.bundle.add, src/typefinity.ts,  build/bundle/typefinity.mjs,  cli dts minify, , $(NORMALIZE_JAVADOC) build/bundle/typefinity.d.ts)

#-----------------------------------------------------------------------------------------------------------------------
# TypeDoc
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target, doc, ................ create API documentation)

.PHONY: doc docs documentation

doc docs documentation typedoc : build/typedoc/index.html;

build/typedoc/index.html : $(LP_PREREQUISITE_TSC)
	. bin/create-api-documentation.sh

#-----------------------------------------------------------------------------------------------------------------------
# Release
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target, release, ............ create the release)

release : build/typedoc/index.html $(LP_PREREQUISITE_BUNDLE)
	. bin/assemble-release.sh

$(call lp.help.add-phony-target , unrelease, .......... (git-) revert the release)

unrelease : ;
	git clean --force -d --quiet docs && git checkout -- docs

#-----------------------------------------------------------------------------------------------------------------------
# Install
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target, install, ............ install the cli package for testing purposes)

install : build/bundle/typefinity.mjs build/bundle/typefinity.d.ts README.md resources/package.json
	   echo Copying package to playground... \
	&& mkdir -p ../typefinity-playground/node_modules/@david-04/typefinity \
	&& cp $^ ../typefinity-playground/node_modules/@david-04/typefinity/

#-----------------------------------------------------------------------------------------------------------------------
# Clean
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.clean.files, build)






#-----------------------------------------------------------------------------------------------------------------------
include .launchpad/Makefile.footer
