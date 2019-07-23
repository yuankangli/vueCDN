define(['./tableData.js'], function () {

    const component = {
        template: `
<span>
    <el-table-column 
            type="selection">
    </el-table-column>
    <el-table-column v-for="(item,index) in this.column_config" :key="item.field" v-if="item.show && item.show.table "
           :prop="item.field"
           :label="item.title"
           :formatter="formatColumn"
           show-overflow-tooltip>
    </el-table-column>
</span>
`,
        data: function () {
            let self = this;
            return {
                formatColumn: function (row, column, cellValue, index) {
                    let property = column.property;
                    let options = self.options;
                    if (options.hasOwnProperty(property)) {
                        let option = options[property]; //数组
                        for(let index in option) {
                            let optionElement = option[index];
                            if (optionElement.value + "" === cellValue + "") {
                                return optionElement.label;
                            }
                        }
                    }
                    let dates = self.dates;
                    if (dates.hasOwnProperty(property)) {
                        let formatStr = dates[property]; //数组
                        if (cellValue) {
                            return dateFormat(formatStr, new Date(cellValue));
                        }
                    }
                    return cellValue;

                }
            }
        },
        props: ['column_config'],
        computed:{
            // 下拉框显示中文
            options: function () {
                let result = {};
                let columnConfig = this.column_config;
                for(let index in columnConfig) {
                    let value = columnConfig[index];
                    if (value.options) {
                        result[value.field] = value.options;
                    }
                }
                return result;
            },
            // 时间格式化
            // date(year, month, week),time,datetime,dateRange,timeRange
            dates: function () {
                let result = {};
                let columnConfig = this.column_config;
                for(let index in columnConfig) {
                    let field = columnConfig[index].field;
                    let value = columnConfig[index].type || "text";
                    if (value === "year") {
                        result[field] = "yyyy";
                    }
                    if (value === "month") {
                        result[field] = "yyyy-MM";
                    }
                    if (value === "date") {
                        result[field] = "yyyy-MM-dd";
                    }
                    if (value === "datetime") {
                        result[field] = "yyyy-MM-dd hh:mm:ss";
                    }
                }
                return result;
            }

        }
/*        watch: {
            'column_config': function (newVal, oldVal) {
                this.curColumnConfig = newVal;
            },
            curColumnConfig: function (newVal, oldVal) {
                this.$emit("update:column_config", newVal);
            },
            'item': function (newVal, oldVal) {
                this.curItem = newVal;
                this.filed = newVal.field;
            },
            curItem: function (newVal, oldVal) {
                this.$emit("update:item", newVal);
            },
            'query_data': function (newVal, oldVal) {
                this.queryDataTemp = newVal;
            },
            queryDataTemp: function (newVal, oldVal) {
                this.$emit("update:query_data", newVal);
            }
        },*/

    };

    return component;
});
