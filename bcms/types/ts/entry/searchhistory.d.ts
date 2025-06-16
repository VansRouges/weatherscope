import type { BCMSEntryContentParsed } from '../content';
import type { BCMSEntryStatuses } from '../status';
import type { PropValueDateData } from '@thebcms/types';

export interface SearchhistoryEntryMetaItem {
    title: string;
    slug: string;
    locationname: string;
    lat: number;
    lon: number;
    timestamp?: PropValueDateData;
    userid: string;
}

export interface SearchhistoryEntryMeta {
    en?: SearchhistoryEntryMetaItem;
}

export interface SearchhistoryEntry {
    _id: string;
    createdAt: number;
    updatedAt: number;
    instanceId: string;
    templateId: string;
    userId: string;
    statuses: BCMSEntryStatuses;
    meta: SearchhistoryEntryMeta;
    content: BCMSEntryContentParsed;
}