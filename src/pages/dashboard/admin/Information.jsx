import { announcementFilters } from "./moduleFilters";

import React from "react";

import { useAnnouncement } from "../../../context/AnnouncementContext";

import RecordManager from "./RecordManager";
import {
  ANNOUNCEMENT_AUDIENCE_OPTIONS,
  ANNOUNCEMENT_PRIORITY_OPTIONS,
} from "../shared/schoolOptions";

export default function Information() {
  const { data } = useAnnouncement();

  const fields = [
    { key: "title", label: "Title", required: true },
    { key: "date", label: "Publish Date", type: "date", required: true },
    {
      key: "audience",
      label: "Audience",
      type: "select",
      options: ANNOUNCEMENT_AUDIENCE_OPTIONS,
      includeDynamic: true,
      default: "Everyone",
      required: true,
    },
    {
      key: "priority",
      label: "Priority",
      type: "select",
      options: ANNOUNCEMENT_PRIORITY_OPTIONS,
      includeDynamic: true,
      default: "Normal",
    },
    {
      key: "description",
      label: "Announcement",
      type: "textarea",
      required: true,
      table: false,
    },
  ];

  return (
    <RecordManager
      title="Announcements"
      description="Publish and manage school-wide or role-specific information."
      data={data}
      fields={fields}
      filters={announcementFilters}
      getLabel={(item) => item.title}
    />
  );
}
