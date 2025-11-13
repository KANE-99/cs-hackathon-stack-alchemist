import { EntryModel } from "@contentstack/utils";
import { encodeMetadataIntoString } from "./metadataEncoder";


interface AppliedVariants {
    _applied_variants: { [key: string]: any }
    shouldApplyVariant: boolean
    metaKey: string
}


/**
 * Adds editable tags to entry by encoding metadata into string values.
 * This eliminates the need for manual $ spreading in components.
 * 
 * @param entry - Entry object to process
 * @param contentTypeUid - Content type UID
 * @param tagsAsObject - Whether to use object format (kept for backward compatibility)
 * @param locale - Locale (default: 'en-us')
 * @param encodeIntoStrings - If true, encode metadata into strings; if false, use legacy $ objects
 */
export function injectCslpData(
    entry: EntryModel, 
    contentTypeUid: string, 
    tagsAsObject: boolean, 
    locale = 'en-us',
): void {
    if (entry) {
        // handle case sensitivity for contentTypeUid and locale
        contentTypeUid = contentTypeUid.toLowerCase();
        locale = locale.toLowerCase();
        
        const appliedVariants = entry._applied_variants || entry?.system?.applied_variants || null;
        
        // New approach: encode metadata directly into string values
        encodeMetadataIntoEntry(
            entry, 
            `${contentTypeUid}.${entry.uid}.${locale}`, 
            locale,
            { _applied_variants: appliedVariants, shouldApplyVariant: !!appliedVariants, metaKey: '' }
        );
    }
}

/**
 * Encodes metadata directly into string values within an entry object.
 * This function mutates the entry object in place, encoding data-cslp paths
 * into string fields using invisible unicode characters.
 */
function encodeMetadataIntoEntry(
    content: any,
    prefix: string,
    locale: string,
    appliedVariants: AppliedVariants
): void {
    const { metaKey, shouldApplyVariant, _applied_variants } = appliedVariants;
    
    Object.entries(content).forEach(([key, value]) => {
        // Skip $ metadata field and internal fields
        if (key === '$' || key.startsWith('_')) return;
        
        const metaUID = (value && typeof value === 'object' && value !== null && 
            (value as any)._metadata && (value as any)._metadata.uid) ? (value as any)._metadata.uid : '';
        let updatedMetakey = shouldApplyVariant ? `${metaKey ? metaKey + '.' : ''}${key}` : '';
        if (metaUID && updatedMetakey) updatedMetakey = updatedMetakey + '.' + metaUID;
        
        switch (typeof value) {
            case "string": {
                // Encode metadata directly into the string value
                const cslpPath = buildCslpPath(`${prefix}.${key}`, { _applied_variants, shouldApplyVariant, metaKey: updatedMetakey });
                content[key] = encodeMetadataIntoString(value, { cslp: cslpPath });
                break;
            }
                
            case "number":
            case "boolean":
                // For primitive non-string values, we can't encode into them
                // These would need to be handled differently or wrapped
                break;
                
            case "object":
                if (value === null) return;
                
                if (Array.isArray(value)) {
                    value.forEach((obj, index) => {
                        if (obj === null || obj === undefined) return;
                        
                        const itemMetaUID = (obj && typeof obj === 'object' && 
                            (obj as any)._metadata && (obj as any)._metadata.uid) ? (obj as any)._metadata.uid : '';
                        let itemUpdatedMetakey = shouldApplyVariant ? `${metaKey ? metaKey + '.' : ''}${key}` : '';
                        if (itemMetaUID && itemUpdatedMetakey) itemUpdatedMetakey = itemUpdatedMetakey + '.' + itemMetaUID;
                        
                        if (typeof obj !== 'undefined' && obj !== null && (obj as any)._content_type_uid !== undefined && (obj as any).uid !== undefined) {
                            // Handle references
                            const newAppliedVariants = (obj as any)._applied_variants || (obj as any)?.system?.applied_variants || null;
                            const newShouldApplyVariant = !!newAppliedVariants;
                            encodeMetadataIntoEntry(
                                obj,
                                `${(obj as any)._content_type_uid}.${(obj as any).uid}.${(obj as any).locale || locale}`,
                                locale,
                                { _applied_variants: newAppliedVariants, shouldApplyVariant: newShouldApplyVariant, metaKey: "" }
                            );
                        } else if (typeof obj === "object") {
                            // Handle objects inside arrays (modular blocks)
                            encodeMetadataIntoEntry(
                                obj,
                                `${prefix}.${key}.${index}`,
                                locale,
                                { _applied_variants, shouldApplyVariant, metaKey: itemUpdatedMetakey }
                            );
                        } else if (typeof obj === "string") {
                            // Encode string values in arrays
                            const cslpPath = buildCslpPath(`${prefix}.${key}.${index}`, { _applied_variants, shouldApplyVariant, metaKey: itemUpdatedMetakey });
                            value[index] = encodeMetadataIntoString(obj, { cslp: cslpPath });
                        }
                    });
                } else {
                    // Handle nested objects
                    encodeMetadataIntoEntry(
                        value,
                        `${prefix}.${key}`,
                        locale,
                        { _applied_variants, shouldApplyVariant, metaKey: updatedMetakey }
                    );
                }
                break;
        }
    });
}



/**
 * Builds the CSLP path with variant support
 */
function buildCslpPath(
    dataValue: string,
    appliedVariants: { _applied_variants: { [key: string]: any } | null, shouldApplyVariant: boolean, metaKey: string }
): string {
    if (appliedVariants.shouldApplyVariant && appliedVariants._applied_variants) {
        const isFieldVariantised = appliedVariants._applied_variants[appliedVariants.metaKey];
        if (isFieldVariantised) {
            const variant = appliedVariants._applied_variants[appliedVariants.metaKey];
            const newDataValueArray = ('v2:' + dataValue).split('.');
            newDataValueArray[1] = newDataValueArray[1] + '_' + variant;
            return newDataValueArray.join('.');
        } else {
            const parentVariantisedPath = getParentVariantisedPath(appliedVariants as AppliedVariants);
            if (parentVariantisedPath) {
                const variant = appliedVariants._applied_variants[parentVariantisedPath];
                const newDataValueArray = ('v2:' + dataValue).split('.');
                newDataValueArray[1] = newDataValueArray[1] + '_' + variant;
                return newDataValueArray.join('.');
            }
        }
    }
    return dataValue;
}


function getParentVariantisedPath(appliedVariants: AppliedVariants) {
    try {
        // Safety fallback
        if(!appliedVariants._applied_variants) return '';
        const variantisedFieldPaths = Object.keys(appliedVariants._applied_variants).sort((a, b) => {
            return b.length - a.length;
        });
        const childPathFragments = appliedVariants.metaKey.split('.');
        // Safety fallback
        if(childPathFragments.length === 0 || variantisedFieldPaths.length === 0) return '';
        const parentVariantisedPath = variantisedFieldPaths.find(path => {
            const parentFragments = path.split('.');
            if(parentFragments.length > childPathFragments.length) return false;
            return parentFragments.every((fragment, index) => childPathFragments[index] === fragment);
        }) ?? '';
        return parentVariantisedPath;
    }
    catch(e) {
        return '';
    }
}