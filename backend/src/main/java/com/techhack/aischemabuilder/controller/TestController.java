package com.parsertest.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class TestController {

    @GetMapping("/test/1")
    public ModelAndView test() {
        return new ModelAndView("bio");
    }

    @GetMapping("/test/2")
    public ModelAndView test2() {
        return new ModelAndView("article");
    }

    @GetMapping("/lenta")
    public ModelAndView testLenta() {
        return new ModelAndView("lemta");
    }
}
