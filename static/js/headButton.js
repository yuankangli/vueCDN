define(['./headButton.js', ''], function () {

    const component = {
        template: `
<span>
    <el-button class="filter-item" type="success" icon="el-icon-search" size="mini" @click.native="query(1)">
        查询
    </el-button>
    <el-button class="filter-item" type="primary" icon="el-icon-document-add" size="mini" @click.native="insertData()">
        新增
    </el-button>    
    <el-button class="filter-item" type="danger" icon="el-icon-delete" size="mini" @click.native="deleteData()">
        批量删除
    </el-button>
    <el-button class="filter-item" type="info" icon="el-icon-download" size="mini">
        导出
    </el-button>
</span>

`,
        data: function () {
            let self = this;
            return {
                //
                query: function (currentPage) {
                    self.$parent.$parent.$refs["query_form"].validate((valid) => {
                        if (valid) {
                            let loading = self.loading;
                            loading.table = true;
                            self.$emit("update:loading", loading);
                            currentPage = currentPage || this.table_config.currentPage;
                            let queryUrl = self.url_config.query;

                            if (queryUrl && queryUrl !== "") {
                                let queryParameter = {
                                    page: currentPage,
                                    rows: this.table_config.pageSize,
                                    field: getFiledList(this.column_config)
                                };
                                queryParameter = appendQuery(queryParameter, self.query_data);
                                this.$ajax({
                                    method: 'post',
                                    url: queryUrl,
                                    params: queryParameter
                                }).then(function (response) {
                                    // TODO 根据自己的返回值进行修改
                                    console.log(response);
                                    // 如果没有查到资料, 说明系统异常
                                    if (!response.data.obj) {
                                        showTip(self, '错误, 请联系管理员', response.data.substring(0, 500), "error"
                                            , {"duration": 15000});
                                        self.$emit("update:loading", false);
                                        return;
                                    }
                                    // self.table_data = response.data.obj;
                                    // 子组件不能直接修改父组件数据， 需使用 $emit 动态修改父数据
                                    self.$emit("update:table_data", response.data.obj.results);
                                    let tableConfigTemp = self.table_config;
                                    tableConfigTemp.total = response.data.obj.total;
                                    if (response.data.obj.total === 0) {
                                        showTip(self, null, '查无资料');
                                    }
                                    tableConfigTemp.currentPage = currentPage;
                                    self.$emit("update:table_config", tableConfigTemp);
                                    loading.table = false;
                                    self.$emit("update:loading", loading);
                                }).catch(function (error) {
                                    self.$emit("update:table_data", []);
                                    loading.table = false;
                                    self.$emit("update:loading", loading);
                                    showTip(self, '错误', '查询时网络出现异常', "error");
                                });
                            } else {
                                // 调用本地资料
                                let localData = localStorage.getItem(self.local_storage_name);
                                localData = JSON.parse(localData) || [];
                                let queryParameter = {
                                    // page: currentPage,
                                    // rows: this.table_config.pageSize,
                                    // field: getFiledList(this.column_config)
                                };
                                queryParameter = appendQuery(queryParameter, self.query_data);
                                let finalData = localData.filter((value, index, arrs) => {
                                    let result = true;
                                    for (let element in queryParameter) {
                                        let queryValue = queryParameter[element] + "";
                                        if (queryValue == null || queryValue === "") {
                                            result = result && true;
                                        } else {
                                            result = result && (value[element]+"").indexOf(queryValue) >= 0
                                        }
                                    }
                                    return result;
                                });
                                let tableConfigTemp = self.table_config;
                                tableConfigTemp.total = finalData.length;
                                if (finalData.length === 0) {
                                    showTip(self, null, '查无资料');
                                }
                                // 获取当前配置的每页行数
                                let rows = this.table_config.pageSize;
                                let maxPage = Math.ceil(finalData.length/rows);
                                let page = currentPage > maxPage? maxPage : currentPage;
                                tableConfigTemp.currentPage = page;
                                self.$emit("update:table_config", tableConfigTemp);
                                loading.table = false;
                                self.$emit("update:loading", loading);
                                self.$emit("update:table_data", finalData.slice((page-1)*rows, page*rows));
                            }
                        } else {
                            showTip(self, "校验失败", '请按要求填写校验条件');

                        }
                    });
                },
                insertData: function () {
                    //
                    let loading = self.loading;
                    loading.insert = true;
                    self.$emit("update:loading", loading);
                },
                deleteData: function (currentId) {
                    // 获取需要删除的id数组
                    let ids = [];
                    if (currentId && currentId !== "") {
                        ids.push(currentId);
                    } else {
                        let rows = this.$parent.$parent.$refs.multipleTable.selection;
                        if (rows && rows.length !== 0) {
                            rows.forEach(row => {
                                ids.push(row[self.key_field]);
                            });
                        }
                    }
                    if (ids.length === 0) {
                        showTip(self, null, '请先勾选需要删除的数据');
                        return;
                    }
                    // 提示用户是否确定删除
                    self.$confirm('即将执行删除操作, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let deleteUrl = self.url_config.delete;
                        if (!isEmpty(deleteUrl)) {
                            this.$ajax({
                                method: 'post',
                                url: deleteUrl,
                                params: {
                                    ids: ids.join(",")
                                }
                            }).then(function (response) {
                                // TODO 根据自己的返回值进行修改
                                console.log(response);
                                showTip(self, '', '删除成功', "success");
                                self.query();
                            }).catch(function (error) {
                                showTip(self, '错误', '删除时网络出现异常:' + error.message, "error");
                            });
                        } else {
                            // 调用本地资料
                            let localData = localStorage.getItem(self.local_storage_name);
                            localData = JSON.parse(localData) || [];
                            localData = localData.filter(element => {
                                return ids.indexOf(element[self.key_field]) === -1;
                            });
                            localStorage.setItem(self.local_storage_name, JSON.stringify(localData));
                            self.query();
                            showTip(self, '', '删除成功', "success");
                        }

                    }).catch(() => {
                        self.$message({
                            type: 'info',
                            message: '删除操作已取消',
                        });
                    });
                }
            }
        },
        props: ['query_data', 'table_config', 'column_config', 'table_data', 'url_config', 'loading'
            , 'key_field', 'local_storage_name'],
        computed: {
            curTableConfig() {
                return this.table_config;
            }
        },
        watch: {
            curTableConfig(val) {
                console.log("页数改变");
                this.query();
            }
        },
        created: function () {
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


function getFiledList(field) {
    return "id,schoolName,admissionName,score,lowestOrder,type,year,remark,city,";
}

function appendQuery(normal, queryParameter) {
    for (var obj in queryParameter) {
        if (queryParameter[obj]) {
            normal[obj] = queryParameter[obj];
        }
    }
    return normal;
}
