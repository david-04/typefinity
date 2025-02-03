include .launchpad/Makefile.header # see .launchpad/Makefile.documentation

#-----------------------------------------------------------------------------------------------------------------------
# Default target
#-----------------------------------------------------------------------------------------------------------------------

autorun.editor: test;

autorun : $(LP_PREREQUISITE_TSC) # $(LP_PREREQUISITE_BUNDLE) or $(LP_PREREQUISITE_BUNDLE_JS) + $(LP_PREREQUISITE_BUNDLE_DTS)
	#$(call lp.run, build/cli/cli.js)

#-----------------------------------------------------------------------------------------------------------------------
# Bundling
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.bundle.add, src/bundles/typefinity-cli.ts,    build/bundle/typefinity-cli.js, cli dts minify sourcemap)
$(call lp.bundle.add, src/bundles/typefinity-core.ts,   build/bundle/typefinity-core.js, cli dts minify sourcemap)
$(call lp.bundle.add, src/bundles/typefinity-test.ts,   build/bundle/typefinity-test.js, cli dts minify sourcemap)
$(call lp.bundle.add, src/bundles/typefinity-web.ts,    build/bundle/typefinity-web.js, cli dts minify sourcemap)

#-----------------------------------------------------------------------------------------------------------------------
# Clean
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.clean.tsc-output)
# $(call lp.clean.bundles)
# $(call lp.clean.npm-packages)
# $(call lp.clean.files, list files here...)





#-----------------------------------------------------------------------------------------------------------------------
include .launchpad/Makefile.footer
