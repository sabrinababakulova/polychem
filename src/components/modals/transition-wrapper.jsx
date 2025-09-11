import { Transition } from "@headlessui/react";
import React from "react";

export const TransitionWrapper = ({ isShow = false, children }) => (
  <>
    <Transition
      show={isShow}
      enter="transition ease-out duration-300 transform"
      enterFrom="-translate-y-[50px]"
      enterTo="translate-y-0"
      leave="transition ease-in duration-300 transform"
      leaveFrom="translate-y-0"
      leaveTo="-translate-y-[100px]"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
      }}
    >
      {children}
    </Transition>
  </>
);

export const TransitionWrapperPopup = ({ isShow = false, children }) => (
  <>
    <Transition
      show={isShow}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      style={{
        zIndex: 40,
        position: "relative",
      }}
    >
      {children}
    </Transition>
  </>
);
export const TransitionWrapperMenu = ({
  isShow = false,
  isRightToLeft = false,
  children,
}) => (
  <>
    <Transition
      show={isShow}
      enter="transition ease-out duration-150 transform"
      enterFrom={
        isRightToLeft ? "translate-x-[1000px]" : "-translate-x-[1000px]"
      }
      enterTo="translate-x-0"
      leave="transition ease-in duration-150 transform"
      leaveFrom="translate-x-0"
      leaveTo={isRightToLeft ? "translate-x-[1000px]" : "-translate-x-[1000px]"}
    >
      {children}
    </Transition>
  </>
);
