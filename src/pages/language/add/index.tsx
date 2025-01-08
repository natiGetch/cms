import DynamicForm from '@/component/forms/componetType'
import AddAndEditWraper from '@/component/layout/addAndEditWarper'
import ButtonComponent from '@/component/ui/button'
import InfoPopOver from '@/component/ui/infoModal'
import usePost from '@/hooks/usePost'
import { singleColumnsLayout } from '@/utils/columnsLayout'
import { Col, Form, Row } from 'antd'
import React from 'react'
type FieldType = {
   label  : String,
   key : String,
   visible : Boolean
}
const AddLanguage = () => {
    const {handlePost} = usePost()
    const [form] = Form.useForm()
    const formConfig = [
        {
            name: 'label',
            label: 'Label',
            inputType: 'input',
            rules : [{required : true , message : 'Enter langugae label'}],
        
        },
        {
            name: 'key',
            label: 'Key',
            inputType: 'input',
            rules : [{required : true , message : 'Enter Key',}],
          
        },
        {
            name: 'isMandatory',
            label: 'Mandatory',
            inputType: 'switch',
            initialValue : false,
            inputProps : {
               style : {
                display : 'flex',
                flexDirection : 'row'
               }
            },
            extra : <InfoPopOver 
                title='If you select this language as mandatory, you will be required to provide content in this language for all relevant sections '/>,
             
         
        },
        {
            name: 'visible',
            label: 'Visible',
            inputType: 'radio',
            initialValue : false,
            extra : <InfoPopOver
            title='If you select this language as visible, it will appear in the dropdown list of available languages for selection.'/>,
            inputProps : {
                options : [{
                    label : 'Visible',
                    value : true
                },
                 {
                    label : 'Hidden',
                    value : false
                 }],
                 optionType : 'button',
                 buttonStyle : "solid" 
            }
        },
    ]
  const formSubmit = async  (values : FieldType) =>{
   const responce =  await handlePost('/api/language',values)
   if(responce.success) {
      form.resetFields()
   } 
  }
  return (
     <AddAndEditWraper>
         <Row>
       <Col {...singleColumnsLayout}>
       <Form
            form = {form}
            onFinish={formSubmit}
             layout='vertical'
>
    <DynamicForm formConfig={formConfig} />
    <ButtonComponent 
        type="primary" 
        htmlType="submit" 
        text='Add Langugae'
        props = {{
            style : {
                width : '100%'
            }
        }}
      />
   
       </Form>
       </Col>
     </Row>
     </AddAndEditWraper>
  )
}

export default AddLanguage
