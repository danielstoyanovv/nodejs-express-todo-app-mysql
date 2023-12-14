import {Item} from "../entity/item.entity";

export class ItemFactory {
    static new(): Item {
        return new Item()
    }
}
