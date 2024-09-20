include .launchpad/Makefile.header # see .launchpad/Makefile.documentation

#-----------------------------------------------------------------------------------------------------------------------
# Default target
#-----------------------------------------------------------------------------------------------------------------------

autorun : test; # $(LP_PREREQUISITE_TSC) # $(LP_PREREQUISITE_BUNDLE) or $(LP_PREREQUISITE_BUNDLE_JS) + $(LP_PREREQUISITE_BUNDLE_DTS)

#-----------------------------------------------------------------------------------------------------------------------
# Test
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target, test, ............... run the unit tests)

test tests : $(LP_PREREQUISITE_TSC)
	. ./bin/run-tests.sh

#-----------------------------------------------------------------------------------------------------------------------
# Bundling
#-----------------------------------------------------------------------------------------------------------------------

NORMALIZE_JAVADOC=. bin/normalize-javadoc-comments.sh

$(call lp.bundle.add, src/core/core.ts, build/bundle/typefinity-core.mjs, cli dts, , $(NORMALIZE_JAVADOC) build/bundle/typefinity-core.d.ts)
$(call lp.bundle.add, src/cli/cli.ts,   build/bundle/typefinity-cli.mjs,  cli dts, , $(NORMALIZE_JAVADOC) build/bundle/typefinity-cli.d.ts)
$(call lp.bundle.add, src/web/web.ts,   build/bundle/typefinity-web.mjs,  web dts, , $(NORMALIZE_JAVADOC) build/bundle/typefinity-web.d.ts)

#-----------------------------------------------------------------------------------------------------------------------
# Documentation
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target, typedoc, ............ create API documentation)

.PHONY: doc docs documentation

doc docs documentation typedoc : build/typedoc/index.html;

build/typedoc/index.html : $(foreach TYPE, core cli web, build/typedoc/$(TYPE)/index.html)
	sed 's|<head>|<head><base href="./cli/"/>|' build/typedoc/cli/index.html > $@

build/typedoc/%/index.html : build/bundle/typefinity-%.d.ts bin/create-api-documentation.sh Makefile resources/typedoc/typedoc.css
	. bin/create-api-documentation.sh "$*"

#-----------------------------------------------------------------------------------------------------------------------
# Release
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target, release, ............ create the release)

release : $(foreach TYPE, core cli web, build/bundle/typefinity-$(TYPE).mjs build/bundle/typefinity-$(TYPE).d.ts build/typedoc/$(TYPE)/index.html)
	. bin/release.sh

$(call lp.help.add-phony-target , unrelease, .......... (git-) revert the release)

unrelease : ;
	git clean --force -d --quiet dist docs && git checkout -- dist docs

#-----------------------------------------------------------------------------------------------------------------------
# Install
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.help.add-phony-target, install, ............ install the cli package for testing purposes)

install : build/bundle/typefinity-cli.mjs build/bundle/typefinity-cli.d.ts dist/typefinity-cli/package.json
	   echo Copying cli package to playground... \
	&& mkdir -p ../typefinity-playground/node_modules/@david-04/typefinity-cli \
	&& cp $^ ../typefinity-playground/node_modules/@david-04/typefinity-cli/

#-----------------------------------------------------------------------------------------------------------------------
# Clean
#-----------------------------------------------------------------------------------------------------------------------

$(call lp.clean.files, build)

#-----------------------------------------------------------------------------------------------------------------------
include .launchpad/Makefile.footer
