import React from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import { BucketProps } from "../typescript/section";
import { getMultilineHTML } from "../helper";

export default function SectionBucket({ section }: { section: BucketProps }) {
  return (
    <div className="member-main-section" data-testid="section-bucket">
      <div className="member-head" data-testid="member-head">
        {section.title_h2 && (
          <h2 data-testid="section-title">
            {section.title_h2}
          </h2>
        )}
        {section.description && (
          <p
            dangerouslySetInnerHTML={getMultilineHTML(section.description)}
            data-testid="section-description"
          ></p>
        )}
      </div>
      <div
        className="member-section"
        data-testid="member-section"
      >
        {section.buckets?.map((bucket, idx) => (
          <div
            className="content-section"
            key={`content-section-${idx}`}
            data-testid={`content-section-${idx}`}
          >
            {bucket.icon && (
              <img
                src={bucket.icon.url}
                alt="bucket icon"
                data-testid={`bucket-icon-${idx}`}
              />
            )}

            {bucket.title_h3 ? (
              <h3
                data-testid={`bucket-title-${idx}`}
              >
                {bucket.title_h3}
              </h3>
            ) : (
              ""
            )}
            <div
              data-testid={`bucket-description-${idx}`}
            >
              {bucket.description && parse(bucket.description)}
            </div>
            {bucket.call_to_action.title ? (
              <Link
                to={
                  bucket.call_to_action.href ? bucket.call_to_action.href : "#"
                }
                data-testid={`bucket-cta-${idx}`}
              >
                {`${bucket.call_to_action.title} -->`}
              </Link>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
