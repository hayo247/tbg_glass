
    Coloris({        
        parent: '.clolorBox',
        theme: 'default',     //default, large, polaroid, pill        
        themeMode: 'light',   //light , dark 모드        
        margin: 0,            //입력 필드와 색선택시 사이 여백        
        alpha: false,          //불투명도 조절        
        format: 'hex',        //포맷  hex rgb hsl auto mixed        
        formatToggle: false,   //포맷 토글        
        clearButton: false,         
        swatches: [ '#264653', '#2a9d8f', "e9c46a", 'rgb(244,162,97)', '#e76f51', '#d62828','navy', '#07b', '#0096c7'],
        inline: false,        
        selectInput: true,
        wrap: true,
        onChange: onColorChange   
    });

    $(function(){ 
	    $("#market_name").val(getParameter("to"));
        
        onColorChange("#314544");
        $("#color-Ris").trigger("click");

        $("#all_delete_cart").on('click', function(){
            $("#colorList").html("");
            $("#tot_count").text(0);
        })
        
        $("#select_delete_cart").on('click', function(){
            var tot = 0;
            $("#colorList tr").each(function(idx, el){
                if($(el).find('.chk input').prop('checked')){
                    $(this).remove()
                }else{                
                    tot += parseInt($(el).find('.cnt input').val());
                }
            })
            
            $("#tot_count").text(tot.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
        })

        $("#sendMail").on('click', function(){
            vaild();
        });

        $("#psnlAdd").on('click', function(){
            fn_layerPop($("#psnlPopup"));
        });
        $("#btnAddCart").on('click', function(){
            if(!$("input[name='gloss']").is(':checked')){
                fn_layerPop($("#alertPopup"), "유무광여부를 선택해주세요.");
                return;
            }
            addCart();
        });
    });
    
    function onColorChange(color){
        var code = ("TB_C" + valcd(color.substr(1,2), 18) + valcd(color.substr(3,2), 24)+ valcd(color.substr(5,2), 32) ).toUpperCase()
        $("#colorArea").css('backgroundColor', color);      
        $("#color-Ris").val(color);      
        $("#code").text(code);
    }

    function valcd(val, n){
        return ((parseInt(val, 16) + n).toString(n)).padStart(2, "0");
    }

    function addCart(){
        var html = "";

        html = "<tr>";
        html += '	<input type="hidden" name="색상" value="' + $("#color-Ris").val() +'">';        
        html += '	<input type="hidden" name="코드" value="' + $("#code").text() +'">';          
        html += '	<input type="hidden" name="유무광" value="' + $("input[name='gloss']:checked").val() +'">';          
        html += "<td class='chk'><input type='checkbox'></td>";
        html += "<td class='val'><span style='background:" +  $("#color-Ris").val() + "'>&emsp;&emsp;</span> " + $("#code").text() + " (" + $("input[name='gloss']:checked").val() + ")</td>";
        html += "<td class='cnt'><input type='number' name='수량' class='cnt' value='1' onchange='calcTotalCnt()'></td>";
        html += "</tr>";

        $("#colorList").append(html);
        var el = document.getElementById('colorList');
        el.scrollTop = el.scrollHeight;
        calcTotalCnt();
    }

    function calcTotalCnt(){
        var tot = 0;

        $("#colorList tr").each(function(idx, el){
            tot += parseInt($(el).find('.cnt input').val());
        })

        $("#tot_count").text( format_num(tot));
    }

    function vaild(){
        if($('#colorList tr').length <= 0){
			fn_layerPop($("#alertPopup"), "장바구니에 제품이 없습니다.");
            return;
        }
        
        if($('#order_name').val() == ""){
			fn_layerPop($("#alertPopup"), "주문자의 성함을 적어주세요.");
            return;
        }
        
        if($('#order_tel').val() == ""){
			fn_layerPop($("#alertPopup"), "주문자의 연락처를 적어주세요.");
            return;
        }
        
        if(!$("#chkAgree").prop('checked')){
			fn_layerPop($("#alertPopup"), "개인정보 취급방침을 동의합니다.");
            return;
        }

        save_img()
    }
    function save_img(){

        var html = "";
	
        $('#colorList tr').each(function(index){
            html += '<tr style=" border-bottom: 2px solid #BDBDBD; height: 60px;">';
            html += '	<td style="border-right: 1px solid #BDBDBD; background:' + $(this).find('input[name="색상"]').val() +'">&nbsp;</td>';
            html += '	<td style="border-right: 1px solid #BDBDBD;">' + $(this).find('input[name="코드"]').val() + '('+  $(this).find('input[name="유무광"]').val()+')</td>';
            html += '	<td style="border-right: 1px solid #BDBDBD;">' + $(this).find('input[name="수량"]').val() +'</td>';
            html += '</tr>';
        });

        $('#saveImgForm ._cartList').html(html);
	
        var dt = new Date();
        var fileNm = "유리샘플견적서";
        
        fileNm = fileNm + dt.toLocaleDateString().replace(/\./gi, '').replace(/\ /gi, '');
        fileNm = fileNm + dt.toTimeString().split(' ')[0].replace(/\:/g, '');

        $("._name").html($('#order_name').val());
        $("._tel").html($('#order_tel').val());
        $("._market").html($('#market_name').val());

        fn_downloadImg('saveImgForm', fileNm);

        send_email();
    }

    // 이메일 보내기
    function send_email(){	
        $('#price_total').val($('#totPrice').text());
        
        var cartTxt = "";
        
        $('#colorList tr').each(function(index){
            if(index != 0){
                cartTxt += "/"
            }
            cartTxt += $(this).find('input[name="색상"]').val() + "|";
            cartTxt += $(this).find('input[name="코드"]').val() + "|" 
            cartTxt += $(this).find('input[name="수량"]').val() + "|" ;
            cartTxt += $(this).find('input[name="유무광"]').val() + "|" ;
        });
        
        $('#cart').val(cartTxt);

        var queryString = $("form[name=emailfrm]").serialize() ;

        $("#loadingPopup").show();
        $.ajax({
            data : queryString,
            type : 'post',
            url : 'https://script.google.com/macros/s/AKfycbwsQE9uwd-y42I6hYDZEFlB6Ypps0ldTyGzKAah2XPNCgtIr91yUAZHI_CEkB0kq1DX/exec',
            dataType : 'json',
            error: function(xhr, status, error){
                fn_layerPop($("#layer_alert"), error);
            },
            success : function(result){
                $("#loadingPopup").hide();
                if(result.result == "error"){
                    fn_layerPop($("#alertPopup"), result.error.message);		
                }else{
                    fn_callBackSendEmail();
                }
            }
        });
    }

    
function fn_callBackSendEmail(){
	$("._payOpt").text($("#tot_count").text());
	fn_layerPop($("#payPopup"));
}
