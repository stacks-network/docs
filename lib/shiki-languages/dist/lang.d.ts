import { TCommonLang, TCommonLangAlias, TOtherLang, TLang } from './types';
import { IRawGrammar } from 'vscode-textmate';
export declare const commonLangIds: TCommonLang[];
export declare const commonLangAliases: TCommonLangAlias[];
export declare const otherLangIds: TOtherLang[];
export interface ILanguageRegistration {
    id: string;
    scopeName: string;
    path: string;
    aliases: string[];
    grammar?: IRawGrammar;
}
export declare function getLangRegistrations(langs: TLang[]): ILanguageRegistration[];
export declare const languages: ILanguageRegistration[];
