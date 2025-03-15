include .launchpad/Makefile.header # see .launchpad/Makefile.documentation

#-----------------------------------------------------------------------------------------------------------------------
# Default target
#-----------------------------------------------------------------------------------------------------------------------

autorun.editor: test;

autorun : $(LP_PREREQUISITE_TSC) # $(LP_PREREQUISITE_BUNDLE) or $(LP_PREREQUISITE_BUNDLE_JS) + $(LP_PREREQUISITE_BUNDLE_DTS)
	#$(call lp.run, build/cli/cli.js)


#-----------------------------------------------------------------------------------------------------------------------
# Compiling
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.tsc.add-after-hook, node bin/normalize-javadoc.mjs $(LP_CFG_TSC_OUT_DIR))

#-----------------------------------------------------------------------------------------------------------------------
# Bundling
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.bundle.add, src/bundles/typefinity-cli.ts,    build/bundle/typefinity-cli.mjs,    cli dts minify sourcemap,, node bin/normalize-javadoc.mjs build/bundle/typefinity-cli.d.ts)
$(call lp.bundle.add, src/bundles/typefinity-test.ts,   build/bundle/typefinity-test.mjs,   cli dts minify sourcemap,, node bin/normalize-javadoc.mjs build/bundle/typefinity-test.d.ts)
$(call lp.bundle.add, src/bundles/typefinity-web.ts,    build/bundle/typefinity-web.mjs,    cli dts minify sourcemap,, node bin/normalize-javadoc.mjs build/bundle/typefinity-web.d.ts)

#-----------------------------------------------------------------------------------------------------------------------
# TypeDoc
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-target, docs, ............... create API documentation)

.PHONY: doc docs documentation typedoc

doc docs documentation typedoc : build/typedoc/index.html;

build/typedoc/index.html : $(LP_PREREQUISITE_TSC) $(wildcard resources/typedoc/*)
	. bin/create-api-documentation.sh

#-----------------------------------------------------------------------------------------------------------------------
# Release
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target , release, ............ assemble the release)

release : bundle typedoc test;
	. ./bin/assemble-release.sh

#-----------------------------------------------------------------------------------------------------------------------
# Publish
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target, publish, ............ publish the npm package and the API documentation)

publish : release;
	. ./bin/publish.sh

#-----------------------------------------------------------------------------------------------------------------------
# Clean
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.clean.files, build dist)

#-----------------------------------------------------------------------------------------------------------------------
include .launchpad/Makefile.footer
