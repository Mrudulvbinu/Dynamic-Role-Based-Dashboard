import React from "react";

const PrintableForm = ({ form }) => {
  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        {form?.title || "Untitled Form"}
      </h2>

      {form?.fields?.map((field, index) => {
        if (!field || !field.label) return null;

        return (
          <div key={index} style={{ marginBottom: "20px" }}>
            <strong>{field.label}</strong>
            <div style={{ marginTop: "8px" }}>
              {field.type === "textarea" || field.type === "text" ? (
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    minHeight: "40px",
                    borderRadius: "4px",
                  }}
                ></div>
              ) : field.type === "select" ? (
                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    minHeight: "40px",
                    borderRadius: "4px",
                  }}
                >
                  Select option here
                </div>
              ) : field.type === "radio" ? (
                <div>
                  {field.options?.map((option, i) => (
                    <div key={i} style={{ marginBottom: "5px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "14px",
                          height: "14px",
                          border: "1px solid #000",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      ></span>
                      {option}
                    </div>
                  ))}
                </div>
              ) : field.type === "checkbox" ? (
                <div>
                  {field.options?.map((option, i) => (
                    <div key={i} style={{ marginBottom: "5px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "14px",
                          height: "14px",
                          border: "1px solid #000",
                          marginRight: "10px",
                        }}
                      ></span>
                      {option}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrintableForm;
