
import {sidebarListEnum} from './vSafeEnum'
import {Platform, StyleSheet} from 'react-native';
export const adminData = [
   
  {
      name: "All",
      route: "ConversationList",
      icon:  "paper-plane",
      bg: "#5DCEE2",
      enum: sidebarListEnum.All
    },
    {
      name: "Mine",
      route: "ConversationList",
      icon: "md-person",
      bg: "#5DCEE2",
      enum: sidebarListEnum.Mine
    },
    {
      name: "Unassigned",
      route: "ConversationList",
      icon: "ios-repeat",
      bg: "#5DCEE2",
      enum: sidebarListEnum.Unassigned
    },
    {
      name: "Closed",
      route: "ConversationList",
      icon: "ios-power",
      bg: "#5DCEE2",
      enum: sidebarListEnum.Closed
    },
  ];
  
  export const userData = [

    {
    name: "Mine",
    route: "ConversationList",
    icon: "md-person",
    bg: "#5DCEE2",
    enum: sidebarListEnum.Mine
    },
    {
    name: "Unassigned",
    route: "ConversationList",
    icon: "ios-repeat",
    bg: "#5DCEE2",
    enum: sidebarListEnum.Unassigned
    },
    {
    name: "Closed",
    route: "ConversationList",
    icon: "ios-power",
    bg: "#5DCEE2",
    enum: sidebarListEnum.Closed
    },
    {
    name: "Spam",
    route: "ConversationList",
    icon: "trash",
    bg: "#5DCEE2",
    enum: sidebarListEnum.Spam
    },
    {
      name: "Team",
      route: "ConversationList",
      icon: "trash",
      bg: "#5DCEE2",
      enum: sidebarListEnum.Team
      },
  ];