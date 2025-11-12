import React from "react";
import "../styles/testPage.scss";
import { useParams } from "react-router-dom";
import EffectiveContentChanges from "../components/e2e/effective-content-changes/effective-content-changes";
import AiAssistant from "../components/e2e/ai-assistant/ai-assistant";
import { TestingLocales } from "../components/e2e/effective-content-changes/testing-locales";

export default function TestPage() {
  const { testCtUid } = useParams();

  return (
    <div className="test-page-container" data-testid="test-page">
      <h1 className="test-page-title">E2E Testing Page</h1>
      <p className="test-page-description">
        This is a test page for E2E testing.
      </p>
      {getTestComponent(testCtUid ?? "")}
    </div>
  );
}

function getTestComponent(testCtUid: string) {
  if (testCtUid.includes("effective_content_changes")) {
    return <EffectiveContentChanges ctUid={testCtUid} />;
  }
  if (testCtUid.includes("ai_assistant_e2e")) {
    return <AiAssistant entryUrl={testCtUid} />;
  }
  if (testCtUid.includes("testing_locales")) {
    return <TestingLocales ctUid={testCtUid} />;
  }

  return null;
}
