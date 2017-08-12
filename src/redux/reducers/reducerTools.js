export const updateObject = function(oldObject, newValues) {
    // 用空对象作为第一个参数传递给 Object.assign，以确保是复制数据，而不是去改变原来的数据
    return Object.assign({}, oldObject, newValues);
}

export const updateItemInArray = function(array, itemId, updateItemCallback) {
    const updatedItems = array.map(item => {
        if(item.id !== itemId) {
            // 因为我们只想更新一个项目，所以保留所有的其他项目
            return item;
        }

        // 使用提供的回调来创建新的项目
        const updatedItem = updateItemCallback(item);
        return updatedItem;
    });

    return updatedItems;
}
