include .launchpad/Makefile.header # see .launchpad/Makefile.documentation

#-----------------------------------------------------------------------------------------------------------------------
# Default target
#-----------------------------------------------------------------------------------------------------------------------

autorun : $(LP_PREREQUISITE_TSC) # $(LP_PREREQUISITE_BUNDLE) or $(LP_PREREQUISITE_BUNDLE_JS) + $(LP_PREREQUISITE_BUNDLE_DTS)
	$(call lp.run, build/cli/cli.js)

#-----------------------------------------------------------------------------------------------------------------------
# Bundling
#-----------------------------------------------------------------------------------------------------------------------

NORMALIZE_JAVADOC=. bin/normalize-javadoc-comments.sh

$(call lp.bundle.add, src/core/core.ts, build/bundle/core.js, cli dts, , $(NORMALIZE_JAVADOC) build/bundle/core.d.ts)
$(call lp.bundle.add, src/cli/cli.ts,   build/bundle/cli.js,  cli dts, , $(NORMALIZE_JAVADOC) build/bundle/cli.d.ts)
$(call lp.bundle.add, src/web/web.ts,   build/bundle/web.js,  web dts, , $(NORMALIZE_JAVADOC) build/bundle/web.d.ts)




#-----------------------------------------------------------------------------------------------------------------------
# Clean
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.clean.tsc-output)
# $(call lp.clean.bundles)
# $(call lp.clean.npm-packages)
# $(call lp.clean.files, list files here...)





#-----------------------------------------------------------------------------------------------------------------------
include .launchpad/Makefile.footer
