import * as Lokijs from 'lokijs'
import type { RecordData } from '../models/modelRecord'
import type { PeopleData } from '../models/modelPeople'

const db = new Lokijs('db')
export const dbData: Collection<RecordData> = db.addCollection('data')
export const dbPeople: Collection<PeopleData> = db.addCollection('people')
