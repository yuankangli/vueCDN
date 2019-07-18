define(['./tablePagination.js'], function () {

    const component = {
        template: `
<el-pagination background class="pagination-container" size="mini" ref="footer"  v-if="this.table_data.length>0"
               :page-sizes="this.table_config.pageSizes"
               :page-size="this.table_config.pageSize"
               :current-page="this.table_config.currentPage"
               layout="sizes, total, prev, pager, next, jumper"
               @current-change="current_change"
               @size-change="size_change"
               :total="this.table_config.total">
</el-pagination>
`,
        data: function () {
            let self = this;
            return {
                current_change:function (currentPage) {
                    console.log("切换分页");
                    let tableConfigTemp = self.table_config;
                    tableConfigTemp.currentPage = currentPage;
                    self.$emit("update:table_config", tableConfigTemp);
                    self.$emit('query');
                },
                size_change: function (pageSize) {
                    console.log("切换分页");
                    localStorage.setItem("table_config_pageSize", pageSize);
                    let tableConfigTemp = self.table_config;
                    tableConfigTemp.pageSize = pageSize;
                    self.$emit("update:table_config", tableConfigTemp);
                    self.$emit('query');
                }
            }
        },
        props: ['table_config','table_data', 'query_data'],
        created:function(){
            let pageSize = localStorage.getItem("table_config_pageSize") || 15;
            pageSize = pageSize * 1;
            this.table_config.total = this.table_config.total || 0;
            this.table_config.pageSize = this.table_config.pageSize || pageSize;
            this.table_config.pageSizes = this.table_config.pageSizes || [10, 15, 20, 30];
            this.table_config.currentPage = this.table_config.currentPage || 1;
        },
    };

    return component;
});
