package com.yupi.yupao.web.util;

import com.yupi.yupao.web.dmain.Usercart;
import lombok.Data;

import java.util.List;

@Data
public class ArryWebCartList {

    private List<Usercart> usercartList;

    @Override
    public String toString() {
        String Josnmy="[";

        for (int i = 0; i < usercartList.size(); i++) {


            Usercart usercart = usercartList.get(i);


            Josnmy+= usercart.toString();


            if(i!=usercartList.size()-1)
            {

                Josnmy+=",";

            }



        }
        Josnmy+="]";
        
        return Josnmy;


    }
    
}
