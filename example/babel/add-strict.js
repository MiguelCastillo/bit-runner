function addStrict(moduleMeta) {
  moduleMeta.source = '"use strict;"\n' + moduleMeta.source;
}

module.exports = addStrict;
