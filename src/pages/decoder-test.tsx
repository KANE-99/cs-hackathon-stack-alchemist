import React, { useState } from 'react';
import { 
  decodeMetadataFromString, 
  hasEncodedMetadata,
  encodeMetadataIntoString 
} from '../utils/metadataEncoder';

/**
 * Temporary test page for encoding/decoding strings with metadata
 * This page helps test and visualize the invisible unicode encoding system
 */
export default function DecoderTest() {
  const [inputValue, setInputValue] = useState('');
  const [decodeResult, setDecodeResult] = useState<{
    cleanValue: any;
    metadata: any;
    hasMetadata: boolean;
  } | null>(null);

  // Example encoded string for testing
  const [exampleCslpPath, setExampleCslpPath] = useState('page.entry_uid_123.en-us.title');
  const [exampleText, setExampleText] = useState('Hello World');

  const handleDecode = () => {
    const hasMetadata = hasEncodedMetadata(inputValue);
    const { cleanValue, metadata } = decodeMetadataFromString(inputValue);
    
    setDecodeResult({
      cleanValue,
      metadata,
      hasMetadata,
    });
  };

  const handleEncode = () => {
    const encoded = encodeMetadataIntoString(exampleText, {
      cslp: exampleCslpPath,
    });
    setInputValue(encoded);
    // Automatically decode it too
    setTimeout(() => {
      const hasMetadata = hasEncodedMetadata(encoded);
      const { cleanValue, metadata } = decodeMetadataFromString(encoded);
      setDecodeResult({
        cleanValue,
        metadata,
        hasMetadata,
      });
    }, 100);
  };

  const handleClear = () => {
    setInputValue('');
    setDecodeResult(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '10px' }}>🔍 Metadata Encoder/Decoder Test Page</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        Test the invisible unicode character encoding system for Contentstack Live Preview
      </p>

      {/* Encoder Section */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '24px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '1px solid #dee2e6'
      }}>
        <h2 style={{ marginTop: 0 }}>✨ Encode a String</h2>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Text to Encode:
          </label>
          <input
            type="text"
            value={exampleText}
            onChange={(e) => setExampleText(e.target.value)}
            placeholder="Enter text to encode"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
            }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            CSLP Path:
          </label>
          <input
            type="text"
            value={exampleCslpPath}
            onChange={(e) => setExampleCslpPath(e.target.value)}
            placeholder="e.g., page.entry_uid.en-us.title"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
            }}
          />
        </div>
        <button
          onClick={handleEncode}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          🔐 Encode String
        </button>
      </div>

      {/* Decoder Section */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '24px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '1px solid #dee2e6'
      }}>
        <h2 style={{ marginTop: 0 }}>🔓 Decode a String</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          Paste an encoded string below to extract the hidden metadata and clean value.
        </p>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Encoded String:
          </label>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste encoded string here..."
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontFamily: 'monospace',
            }}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Length: {inputValue.length} characters
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleDecode}
            disabled={!inputValue}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: inputValue ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: inputValue ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
            }}
          >
            🔍 Decode String
          </button>
          <button
            onClick={handleClear}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Results Section */}
      {decodeResult && (
        <div style={{ 
          background: decodeResult.hasMetadata ? '#d4edda' : '#f8d7da',
          padding: '24px', 
          borderRadius: '8px',
          border: `1px solid ${decodeResult.hasMetadata ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <h2 style={{ marginTop: 0, color: decodeResult.hasMetadata ? '#155724' : '#721c24' }}>
            {decodeResult.hasMetadata ? '✅ Metadata Found!' : '❌ No Metadata Found'}
          </h2>

          {decodeResult.hasMetadata ? (
            <>
              {/* Clean Value */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>Clean Value:</h3>
                <div style={{ 
                  background: 'white', 
                  padding: '12px', 
                  borderRadius: '4px',
                  border: '1px solid #c3e6cb',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                }}>
                  {decodeResult.cleanValue || '(empty)'}
                </div>
                <button
                  onClick={() => copyToClipboard(decodeResult.cleanValue)}
                  style={{
                    marginTop: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  📋 Copy Clean Value
                </button>
              </div>

              {/* Metadata */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>Extracted Metadata:</h3>
                <div style={{ 
                  background: 'white', 
                  padding: '12px', 
                  borderRadius: '4px',
                  border: '1px solid #c3e6cb',
                }}>
                  {decodeResult.metadata ? (
                    <>
                      <div style={{ marginBottom: '12px' }}>
                        <strong>CSLP Path:</strong>
                        <div style={{ 
                          fontFamily: 'monospace', 
                          fontSize: '14px',
                          marginTop: '4px',
                          padding: '8px',
                          background: '#f8f9fa',
                          borderRadius: '4px',
                        }}>
                          {decodeResult.metadata.cslp}
                        </div>
                        <button
                          onClick={() => copyToClipboard(decodeResult.metadata.cslp)}
                          style={{
                            marginTop: '8px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          📋 Copy CSLP Path
                        </button>
                      </div>
                      {decodeResult.metadata.parentField && (
                        <div>
                          <strong>Parent Field:</strong>
                          <div style={{ 
                            fontFamily: 'monospace', 
                            fontSize: '14px',
                            marginTop: '4px',
                            padding: '8px',
                            background: '#f8f9fa',
                            borderRadius: '4px',
                          }}>
                            {decodeResult.metadata.parentField}
                          </div>
                        </div>
                      )}
                      <div style={{ marginTop: '12px' }}>
                        <strong>Full Metadata JSON:</strong>
                        <pre style={{ 
                          fontFamily: 'monospace', 
                          fontSize: '12px',
                          marginTop: '4px',
                          padding: '12px',
                          background: '#f8f9fa',
                          borderRadius: '4px',
                          overflow: 'auto',
                        }}>
                          {JSON.stringify(decodeResult.metadata, null, 2)}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <em>No metadata object found</em>
                  )}
                </div>
              </div>

              {/* Data Attributes Preview */}
              <div>
                <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>Data Attributes (for JSX):</h3>
                <div style={{ 
                  background: 'white', 
                  padding: '12px', 
                  borderRadius: '4px',
                  border: '1px solid #c3e6cb',
                }}>
                  <pre style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '12px',
                    margin: 0,
                  }}>
                    {`data-cslp="${decodeResult.metadata.cslp}"`}
                    {decodeResult.metadata.parentField && `\ndata-cslp-parent-field="${decodeResult.metadata.parentField}"`}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <p style={{ color: '#721c24', marginBottom: 0 }}>
              The input string does not contain encoded metadata. It may be a regular string without encoding.
            </p>
          )}
        </div>
      )}

      {/* Info Section */}
      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        background: '#e7f3ff',
        borderRadius: '8px',
        border: '1px solid #b3d9ff'
      }}>
        <h3 style={{ marginTop: 0 }}>ℹ️ How It Works</h3>
        <ul style={{ fontSize: '14px', lineHeight: '1.6' }}>
          <li>
            <strong>Encoding:</strong> Metadata is encoded using 5 invisible unicode characters 
            (Word Joiner, Zero Width Space, Zero Width Non-Joiner, Zero Width Joiner, Invisible Separator)
          </li>
          <li>
            <strong>Invisible:</strong> The encoded characters are completely invisible to users - 
            the text displays normally
          </li>
          <li>
            <strong>Format:</strong> Original text + START_MARKER + binary_encoded_json + END_MARKER
          </li>
          <li>
            <strong>Usage:</strong> Automatically detected by AutoEditableWrapper component to apply 
            data-cslp attributes
          </li>
          <li>
            <strong>Binary Encoding:</strong> Each character is converted to 16-bit binary, 
            then each bit is represented as an invisible unicode character
          </li>
        </ul>
      </div>
    </div>
  );
}
