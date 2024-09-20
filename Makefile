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
# Documentation
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target , typedoc, ............ create API documentation ) # register a target and make it .PHONY

.PHONY: doc docs documentation

doc docs documentation typedoc : build/typedoc/index.html;

build/typedoc/index.html : $(foreach CORE_CLI_WEB, core cli web, build/typedoc/$(CORE_CLI_WEB)/index.html)
	sed 's|<head>|<head><base href="./cli/"/>|' build/typedoc/cli/index.html > $@

build/typedoc/%/index.html : build/bundle/%.d.ts bin/create-api-documentation.sh Makefile resources/typedoc/typedoc.css
	. bin/create-api-documentation.sh "$*"

#-----------------------------------------------------------------------------------------------------------------------
# Clean
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.clean.tsc-output)
# $(call lp.clean.bundles)
# $(call lp.clean.npm-packages)
# $(call lp.clean.files, list files here...)





#-----------------------------------------------------------------------------------------------------------------------
include .launchpad/Makefile.footer
