#-----------------------------------------------------------------------------------------------------------------------
# This Makefile requires GNU Make
#-----------------------------------------------------------------------------------------------------------------------

.SILENT :

#-----------------------------------------------------------------------------------------------------------------------
# Utility functions
#-----------------------------------------------------------------------------------------------------------------------

NESTING=* */* */*/* */*/*/* */*/*/*/* */*/*/*/*/* */*/*/*/*/*/* */*/*/*/*/*/*/* */*/*/*/*/*/*/*/* */*/*/*/*/*/*/*/*/*
WILDCARD_NESTED=$(foreach pattern, $(2), $(wildcard \
					$(strip $(1))/$(strip $(pattern)) \
					$(patsubst %, $(strip $(1))/%/$(strip $(pattern)), $(NESTING)) \
				))

define DEPENDENCY_TARGET # $(1) phony name $(2) output/timestamp file $(3) prerequisites $(4) sources/dependencies
.PHONY: $(1)
$(1) : $(2);
$(2) : $(3)
	$(4) && mkdir -p "$(2)/.." && touch $(2)
endef

define PHONY_TARGET # $(1) phony name $(2) sources/dependencies
.PHONY: $(1)
$(1) : ;
	$(2)
endef

#-----------------------------------------------------------------------------------------------------------------------
# Target descriptions
#-----------------------------------------------------------------------------------------------------------------------

CLEAN_DESCRIPTION       = remove the build directory
PACKAGE_DESCRIPTION     = create the NPM package
RELEASE_DESCRIPTION     = create a release
UNRELEASE_DESCRIPTION   = revert dist and docs
RUN_DESCRIPTION         = run the playground module
TSC_DESCRIPTION         = compile sources via tsc
TYPEDOC_DESCRIPTION     = create the API documentation
UPLIFT_DESCRIPTION      = upgrade to the lasted Node version
WEBPACK_DESCRIPTION     = bundle library via webpack
TEMPLATES_DESCRIPTION   = update the file templates

#-----------------------------------------------------------------------------------------------------------------------
# Help
#-----------------------------------------------------------------------------------------------------------------------

help autorun :
	$(info )
	$(info $()  clean ........ $(strip $(CLEAN_DESCRIPTION)))
	$(info $()  package ...... $(strip $(PACKAGE_DESCRIPTION)))
	$(info $()  release ...... $(strip $(RELEASE_DESCRIPTION)))
	$(info $()  run .......... $(strip $(RUN_DESCRIPTION)))
	$(info $()  templates .... $(strip $(TEMPLATES_DESCRIPTION)))
	$(info $()  tsc .......... $(strip $(TSC_DESCRIPTION)))
	$(info $()  typedoc ...... $(strip $(TYPEDOC_DESCRIPTION)))
	$(info $()  unrelease .... $(strip $(UPLIFT_DESCRIPTION)))
	$(info $()  uplift ....... $(strip $(UPLIFT_DESCRIPTION)))
	$(info $()  webpack ...... $(strip $(WEBPACK_DESCRIPTION)))

#-----------------------------------------------------------------------------------------------------------------------
# Timestamp files
#-----------------------------------------------------------------------------------------------------------------------

FILE_TEMPLATES_TS           = src/core/resources/file-templates.ts
TSC_TIMESTAMP_FILE          = build/tsc/timestamp.tmp
WEBPACK_SRC_TIMESTAMP_FILE  = build/webpack/src/timestamp.tmp
WEBPACK_TIMESTAMP_FILE      = build/webpack/bundles/timestamp.tmp
PACKAGE_TIMESTAMP_FILE      = build/package/package.json
TYPEDOC_TIMESTAMP_FILE      = build/typedoc/index.html

#-----------------------------------------------------------------------------------------------------------------------
# Targets
#-----------------------------------------------------------------------------------------------------------------------

$(eval $(call DEPENDENCY_TARGET, \
	compile tsc, \
	$(TSC_TIMESTAMP_FILE), \
	$(call WILDCARD_NESTED, src, *.ts) $(FILE_TEMPLATES_TS), \
	scripts/tsc.sh \
))

$(eval $(call DEPENDENCY_TARGET, \
	webpack bundle, \
	$(WEBPACK_TIMESTAMP_FILE), \
	$(WEBPACK_SRC_TIMESTAMP_FILE), \
	scripts/webpack.sh \
))

$(eval $(call DEPENDENCY_TARGET, \
	package, \
	$(PACKAGE_TIMESTAMP_FILE), \
	$(WEBPACK_TIMESTAMP_FILE), \
	scripts/package.sh \
))

$(eval $(call DEPENDENCY_TARGET, \
	normalise normalize, \
	$(WEBPACK_SRC_TIMESTAMP_FILE), \
	$(TSC_TIMESTAMP_FILE), \
	scripts/prepare-webpack-sources.sh \
))

$(eval $(call DEPENDENCY_TARGET, \
	templates, \
	$(FILE_TEMPLATES_TS), \
	$(wildcard resources/templates/*), \
	scripts/update-file-templates.sh \
))

$(eval $(call DEPENDENCY_TARGET, \
	doc docs typedoc, \
	$(TYPEDOC_TIMESTAMP_FILE), \
	$(WEBPACK_SRC_TIMESTAMP_FILE), \
	scripts/typedoc.sh \
))

$(eval $(call PHONY_TARGET, \
	update-version-number-and-copyright, \
	scripts/update-version-information.sh \
))

$(eval $(call PHONY_TARGET, \
	uplift, \
	scripts/uplift.sh \
))

$(eval $(call PHONY_TARGET, \
	unrelease, \
	git checkout -- docs dist \
))

$(eval $(call PHONY_TARGET, \
	run, \
	node --enable-source-maps build/tsc/debug.js \
))

release : clean update-version-number-and-copyright package typedoc;
	rm -rf docs && mkdir docs  && cp -r build/typedoc/* docs/

clean :
    ifneq "$(wildcard build)" ""
	rm -rf build
    endif
