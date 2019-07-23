define(['./headForm.js'], function () {

    const component = {
        template: `
<el-form-item :label="item.title + ':'" v-if="item.show.query" :prop="item.field" >
    <el-time-select  v-if="item.type==='time'" @focus="refreshTime" :prop="item.field"
        :placeholder="item.title"
        v-model="queryDataTemp[item.field]"
        :picker-options="item.options" >
    </el-time-select>
    <el-date-picker v-else-if="item.type==='year'" :prop="item.field"
        v-model="queryDataTemp[item.field]"
        type="year"
        value-format="yyyy"
        placeholder="选择年">
    </el-date-picker>
    <el-date-picker v-else-if="item.type==='month'" :prop="item.field"
        v-model="queryDataTemp[item.field]"
        type="month"
        value-format="yyyy-MM"
        placeholder="选择年月">
    </el-date-picker>
    <el-date-picker v-else-if="item.type==='week'" :prop="item.field"
        v-model="queryDataTemp[item.field]"
        type="week"
        format="yyyy 第 WW 周"
         value-format="yyyy-WW"
        placeholder="选择周次">
    </el-date-picker>
    <el-date-picker v-else-if="item.type==='date'" :prop="item.field"
        v-model="queryDataTemp[item.field]"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期">
    </el-date-picker>
    <el-date-picker v-else-if="item.type==='dateRange'" :prop="item.field"
        v-model="queryDataTemp[item.field]"
        type="daterange"
        
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
    </el-date-picker>
    <el-date-picker v-else-if="item.type==='dateTime'" :prop="item.field"
        v-model="queryDataTemp[item.field]"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期时间">
    </el-date-picker>
    <el-select v-else-if="item.type==='select'" filterable clearable :prop="item.field"
        v-model="queryDataTemp[item.field]" placeholder="请选择" >
        <el-option 
          v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value">
          <span style="float: left">{{ option.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ option.value }}</span>
        </el-option>
    </el-select>
    <el-input  v-else clearable v-model="queryDataTemp[item.field]" 
        :placeholder="item.title" :name="item.field" >
        
    </el-input>
</el-form-item>
`,
        data: function () {
            let self = this;
            return {
                curColumnConfig: this.column_config,
                queryDataTemp: this.query_data,
                refreshTime: function (obj) {
                    // TODO minTime属性处于失效中,暂时没法获取前面的值
                    // obj.$options.propsData.pickerOptions.minTime= "9:00";
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('item.value', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('item.value', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('item.value', date);
                        }
                    }]
                },
            }
        },
        props: ['column_config', 'item', 'query_data'],
        created:function(){

        },
        watch: {
            // curColumnConfig: {
            //     handler: function (newVal, oldVal) {
            //         // alert(123);
            //     },
            //     deep: true
            // },
        }
    };

    return component;
});
