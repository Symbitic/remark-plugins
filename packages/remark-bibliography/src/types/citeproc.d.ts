/*
// declare module 'style-chicago'

declare module "style-chicago" {
  type RecordType = Record<string, any>

  const style: RecordType;
  export default style;
}

CSL.Engine = function (sys, style, lang, forceLang) {}

CSL.setupXml = function(xmlObject) {}
localexml = CSL.setupXml(this.sys.retrieveLocale("en-US"));

*/

declare module "citeproc" {
  interface Sys {
    retrieveLocale: (locale: string) => any;
    retrieveItem: (id: string) => any
  }

  type EntryIds = string[]

  interface Bibliography {
    entry_ids: EntryIds[];
  }

  // Temporary
  type Style = Record<string, any>;

  class Engine {
    constructor(sys: Sys, style: Style);

    updateItems(items: string[]): void;

    makeCitationCluster(items: any[]): string;

    makeBibliography(): [ Bibliography, string[] ];
  }
}
