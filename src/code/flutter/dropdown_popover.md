---

title: Flutter单选多选、Popover的实现
description: 最近开发Flutter项目时发现，Flutter的组件`DropdownButton`使用时会有一些使用上的局限性（尤其是在Flutter Web中），所以在项目开发中，使用了两个组件做为`DropdownButton`组件的补充和拓展。本文旨在介绍组件，比较应用向，如果对组件想要更深入了解，请阅读官方文档。
icon: newspaper
isOriginal: false
date: 2023/01/17
category:
 - 移动端
tag:
 - flutter
sticky: false
article: true
timeline: true
cover: https://fastly.jsdelivr.net/gh/comradeWong/ImageStorageService@master/img/202311171537461.png

---

# Flutter单选多选、Popover的实现
最近开发Flutter项目时发现，Flutter的组件`DropdownButton`使用时会有一些使用上的局限性（尤其是在Flutter Web中），所以在项目开发中，使用了两个组件做为`DropdownButton`组件的补充和拓展。本文旨在介绍组件，比较应用向，如果对组件想要更深入了解，请阅读官方文档。

## dropdown_search
官方文档地址：[https://pub.dev/packages/dropdown_search](https://pub.dev/packages/dropdown_search)
参考资料：[https://morioh.com/p/bd8d453ec55e](https://morioh.com/p/bd8d453ec55e)

### 单选列表
| 参数名       | 类型                             | 描述                      |
| ------------ | -------------------------------- | ------------------------- |
| items        | `List<T>`                        | 本地设置的选项列表        |
| popupProps   | `PopupProps`                     | popup的设置class          |
| itemAsString | `DropdownSearchItemAsString<T> ` | 自定义options中显示的名称 |
| onChanged    | `ValueChanged<T?>?`              | 当一个item被选中后的回调  |
| selectedItem | `T?`                               | 单选时选中对象            |
|      selectedItems        |    `List<T>`                             |               多选的时候选中的列表            |

```dart
Expanded(  
  child: DropdownSearch<LabelList>(  
    items: options,  
    popupProps: const PopupProps.menu(),  
    itemAsString: (option) => option.labelName,  
    onChanged: (value) {  
      setState(() {  
        selectedLabelList = value!;  
        valueOptions = value.labelValues;  
      });    
    },
    selectedItem: selectedLabelList,  
  ),)
```
这样你就得到了一个简单不带筛选功能的单选Select。
![](https://raw.githubusercontent.com/comradeWong/ImageStorageService/master/img/Snipaste_2023-01-17_12-29-54.png)

### 多选列表

| 参数名        | 类型                             | 描述                                               |     |
| ------------- | -------------------------------- | -------------------------------------------------- | --- |
| items         | `List<T>`                        | 本地设置的选项列表                                 |     |
| popupProps    | `PopupPropsMultiSelection`       | popup的设置class                                   |     |
| itemAsString  | `DropdownSearchItemAsString<T> ` | 自定义options中显示的名称                          |     |
| onChanged     | `ValueChanged<T?>?`              | 当一个item被选中后的回调                           |     |
| selectedItems | `List<T>`                        | 多选的时候选中的列表                               |     |
| compareFn     | `DropdownSearchCompareFn<T>?`    | 比对items与selectedItems的参数（用于回显选中状态） |     |
|               |                                  |                                                    |     |

```dart
Expanded(  
  child: DropdownSearch<Trigger>.multiSelection(  
    items: valueOptions,  
    popupProps: PopupPropsMultiSelection.menu(  
      showSearchBox: true,  
      searchFieldProps: TextFieldProps(  
          controller: TextEditingController(text: ''),  
          decoration:  
              const InputDecoration(hintText: '搜索标签')),  
    ),    
    itemAsString: (option) => option.value,  
    onChanged: (selectedList) {  
      setState(() {  
        triggerSelected = [...selectedList];  
      });    
    },    
    selectedItems: triggerSelected,  
    compareFn: (item1, item2) =>  
        item1.valueId == item2.valueId,  
  ),)

```
这样你也就获得了一个带有筛选功能多选框组。
![](https://raw.githubusercontent.com/comradeWong/ImageStorageService/master/img/Snipaste_2023-01-17_14-09-56.png)

## dropdown_button2
官方文档地址：[https://pub.dev/packages/dropdown_button2](https://pub.dev/packages/dropdown_button2)

（其实官网文档写的很详细，下面提供参数翻译和一个小例子）
| Option                     | Description                                                          | Type                          | Required |
| -------------------------- | -------------------------------------------------------------------- | ----------------------------- | -------- |
| items                      | 用户可以选择的项目列表                                               | `List<DropdownMenuItem>`      | Yes      |
| hint                       | 在用户选择一个项目之前显示的占位符                                   | Widget                        | No       |
| disabledHint               | 如果下拉菜单被禁用，显示的占位符。                                   | Widget                        | No       |
| value                      | 当前选择的[DropdownMenuItem]的值                                     | T                             | No       |
| onChanged                  | 当用户选择一个项目时被调用                                           | ValueChanged<T?>              | No       |
| onMenuStateChange          | 当下拉菜单被打开或关闭时被调用                                       | Function(bool isOpen)         | No       |
| selectedItemBuilder        | 所选项目将如何在按钮上显示                                           | DropdownButtonBuilder         | No       |
| buttonHeight               | 按钮的高度                                                           | double                        | No       |
| buttonWidth                | 按钮的宽度                                                           | double                        | No       |
| buttonPadding              | 按钮的内部填充物                                                     | EdgeInsetsGeometry            | No       |
| buttonDecoration           | 按钮的装饰                                                           | BoxDecoration                 | No       |
| buttonElevation            | 按钮的高度                                                           | int                           | No       |
| buttonSplashColor          | 按钮InkWell的亮光颜色                                                | Color                         | No       |
| buttonHighlightColor       | 按钮InkWell的高光色                                                  | Color                         | No       |
| buttonOverlayColor         | 按钮InkWell的叠加颜色                                                | MaterialStateProperty<Color?> | No       |
| icon                       | 下拉按钮的后缀图标                                                   | Widget                        | No       |
| iconOnClick                | 打开下拉菜单时显示不同的图标                                         | Widget                        | No       |
| iconSize                   | 图标的大小                                                           | double                        | No       |
| iconEnabledColor           | 如果按钮被激活，图标的颜色                                           | Color                         | No       |
| iconDisabledColor          | 如果按钮被禁用，图标的颜色                                           | Color                         | No       |
| itemHeight                 | 菜单项的高度                                                         | double                        | No       |
| itemPadding                | 菜单项的padding                                                      | EdgeInsetsGeometry            | No       |
| itemSplashColor            | 项目的InkWell的亮色                                                  | Color                         | No       |
| itemHighlightColor         | 项目的InkWell的高亮颜色                                              | Color                         | No       |
| dropdownMaxHeight          | 下拉菜单的最大高度                                                   | double                        | No       |
| dropdownWidth              | 下拉菜单的宽度                                                       | double                        | No       |
| dropdownPadding            | 下拉菜单的内部padding                                                | EdgeInsetsGeometry            | No       |
| dropdownScrollPadding      | 包括滚动条在内的下拉菜单的内部padding                                | EdgeInsetsGeometry            | No       |
| dropdownDecoration         | 下拉菜单的装饰                                                       | BoxDecoration                 | No       |
| dropdownDirection          | 下拉菜单相对于按钮的方向                                             | DropdownDirection             | No       |
| dropdownElevation          | 下拉菜单的高度                                                       | int                           | No       |
| selectedItemHighlightColor | 当前所选项目的高亮颜色                                               | Color                         | No       |
| scrollbarRadius            | 滚动条边角的半径                                                     | Radius                        | No       |
| scrollbarThickness         | 滚动条的厚度                                                         | double                        | No       |
| scrollbarAlwaysShow        | 始终显示滚动条，即使是在没有滚动的情况下                             | bool                          | No       |
| offset                     | 改变下拉菜单的位置                                                   | Offset                        | No       |
| customButton               | 使用自定义的小部件，如图标、图片等，而不是默认的按钮。               | Widget                        | No       |
| customItemsHeights         | 为菜单项使用不同的预定义高度（对添加分隔符很有用）。                 | List                          | No       |
| isExpanded                 | 使按钮的内部内容扩大（设置为真以避免长文本溢出）。                   | bool                          | No       |
| openWithLongPress          | 在长按时打开下拉菜单，而不是轻触。                                   | bool                          | No       |
| dropdownOverButton         | 在按钮上方而不是下方打开下拉菜单                                     | bool                          | No       |
| dropdownFullScreen         | 在全屏模式下打开下拉菜单（在AppBar和TabBar上面）                     | bool                          | No       |
| focusColor                 | 使用传统界面（键盘和鼠标）输入焦点时的按钮颜色                       | Color                         | No       |
| barrierDismissible         | 你是否可以通过点击模态障碍物来取消这一途径                           | bool                          | No       |
| barrierColor               | 模态屏障的颜色。如果这个颜色为空，屏障将是透明的                     | Color                         | No       |
| barrierLabel               | 用于可撤销障碍物的语义标签                                           | String                        | No       |
| searchController           | 用于可搜索下拉菜单的控制器，如果为空，那么它将作为普通下拉菜单执行。 | TextEditingController         | No       |
| searchInnerWidget          | 用于可搜索下拉菜单顶部的部件，用于可搜索下拉菜单的部件。             | Widget                        | No       |
| searchMatchFn              | 用于可搜索下拉菜单的匹配函数，如果为空，将使用defaultFn              | SearchMatchFn                 | No       |

```dart
DropdownButtonHideUnderline(  
  child: DropdownButton2(  
    isExpanded: true,  
    hint: Row(  
      children: const [  
        Expanded(  
          child: Text(  
            '更多',  
            style: TextStyle(  
              fontSize: 14,  
              fontWeight: FontWeight.bold,  
              color: Colors.white,  
            ),            overflow: TextOverflow.ellipsis,  
          ),),],),    
          items: _items .map(  
          (e) => DropdownMenuItem<MoreOption>(  
              value: e,  
              child: Text(  
                e.label,  
                style: const TextStyle(  
                  fontSize: 14,  
                  fontWeight: FontWeight.bold,  
                  color: Colors.black45,  
                ),                
                overflow: TextOverflow.ellipsis,  
              )),).toList(),  
    // value: _selectedValue,  
    onChanged: (item) {  
      item?.onTap();  
    },    
    buttonHeight: 36,  
    buttonWidth: 80,  
    buttonPadding: const EdgeInsets.only(left: 12, right: 12),  
    buttonDecoration: BoxDecoration(  
      borderRadius: BorderRadius.circular(40),  
      // border: Border  
      color: kPrimaryColor,  
    ),    
    buttonElevation: 2,  
    iconDisabledColor: Colors.grey,  
    iconEnabledColor: Colors.white,  
    itemHeight: 40,  
    itemPadding:  
        const EdgeInsets.only(left: 14, right: 14),  
    dropdownMaxHeight: 400,  
    dropdownWidth: 200,  
    dropdownPadding: null,  
    dropdownDecoration: BoxDecoration(  
      borderRadius: BorderRadius.circular(14),  
      color: Colors.white,  
    ),    
    dropdownElevation: 8,  
    scrollbarRadius: const Radius.circular(40),  
    scrollbarThickness: 6,  
    scrollbarAlwaysShow: true,  
    offset: const Offset(-20, 0),  
  ),)
```

![](https://raw.githubusercontent.com/comradeWong/ImageStorageService/master/img/Snipaste_2023-01-17_14-57-49.png)


## appflowy_popover
上述两个组件，可以基本实现下拉框的功能，但是不能手动触发popover，这里推荐一个开源项目封装的popover，以供参考：

[AppFlowy](https://github.com/AppFlowy-IO/AppFlowy/blob/main/frontend/app_flowy/packages/appflowy_popover/README.md)


