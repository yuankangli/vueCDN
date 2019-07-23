define(['./headForm.js'], function () {

    const component = {
        template: `
<el-form-item :label="item.title + ':'" v-if="this.show" :prop="item.field" >
    <el-time-select  v-if="item.type==='time'" @focus="refreshTime" :prop="item.field"  style="width: 100%;"
        :placeholder="item.title"
        v-model="dataTemp[item.field]"
        :picker-options="item.options" >
    </el-time-select>
    <el-date-picker v-else-if="item.type==='year'" :prop="item.field"  style="width: 100%;"
        v-model="dataTemp[item.field]"
        type="year"
        placeholder="选择年">
    </el-date-picker>
    <el-date-picker v-else-if="item.type==='month'" :prop="item.field"  style="width: 100%;"
        v-model="dataTemp[item.field]"
        type="month"
        placeholder="选择年月">
    </el-date-picker>
    <el-date-picker v-else-if="item.type==='week'" :prop="item.field"  style="width: 100%;"
        v-model="dataTemp[item.field]"
        type="week"
        format="yyyy 第 WW 周"
        placeholder="选择周次">
    </el-date-picker>
    <el-date-picker v-else-if="item.type==='date'" :prop="item.field"  style="width: 100%;"
        v-model="dataTemp[item.field]"
        type="date"
        placeholder="选择日期">
    </el-date-picker>
    <el-date-picker v-else-if="item.type==='dateRange'" :prop="item.field"  style="width: 100%;"
        v-model="dataTemp[item.field]"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
    </el-date-picker>
    <el-date-picker v-else-if="item.type==='dateTime'" :prop="item.field"  style="width: 100%;"
        v-model="dataTemp[item.field]"
        type="datetime"
        placeholder="选择日期时间">
    </el-date-picker>
    <el-select v-else-if="item.type==='select'" filterable clearable :prop="item.field"  style="width: 100%;"
        v-model="dataTemp[item.field]" placeholder="请选择" >
        <el-option 
          v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value">
          <span style="float: left">{{ option.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ option.value }}</span>
        </el-option>
    </el-select>
    <el-input  v-else clearable v-model="dataTemp[item.field]" style="width: 100%;"
        :placeholder="item.title" :name="item.field" >
        
    </el-input>
</el-form-item>
`,
        data: function () {
            let self = this;
            return {
                dataTemp: this.form_data,
            }
        },
        props: ['column_config', 'item', 'form_data', 'show'],
        watch: {
            'form_data': function (newVal) {
                this.dataTemp = newVal;
            },
            dataTemp: function (newVal) {
                this.$emit("update:form_data", newVal);
            }
        },
        created:function(){
        },


    };

    return component;
});
