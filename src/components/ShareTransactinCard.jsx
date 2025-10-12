import React, { useState } from 'react';
import NorthWestIcon from "@mui/icons-material/NorthWest";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomModal from "../mui_comps/CustomModal";

export default function ShareTransactionCard({
  message, date, amount, type, clientName
}) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  // Define maximum character length for truncation
  const MAX_DESCRIPTION_LENGTH = 25;
  const isDescriptionLong = message && message.length > MAX_DESCRIPTION_LENGTH;
  const truncatedMessage = isDescriptionLong ? message.substring(0, MAX_DESCRIPTION_LENGTH) + "..." : message;

  const handleEyeIconClick = (e) => {
    e.stopPropagation();
    setShowDetailModal(true);
  };

  const handleDescriptionClick = (e) => {
    e.stopPropagation();
    setShowDescriptionModal(true);
  };

  return (
    <>
      <div className="transaction-card-in-share">
        {type == "recived" ? (
          <ArrowCircleDownIcon sx={{ color: "green", marginLeft: "5px", flexShrink: 0 }} />
        ) : (
          <ArrowCircleUpIcon
            sx={{ color: "rgb(255, 0, 111)", marginLeft: "5px", flexShrink: 0 }}
          />
        )}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span className="sender-reciver-transaction-comment" title={message}>
              {truncatedMessage}
            </span>
            {isDescriptionLong && (
              <VisibilityIcon
                sx={{
                  color: "rgba(20, 241, 149, 0.7)",
                  fontSize: "16px",
                  cursor: "pointer",
                  flexShrink: 0,
                  '&:hover': {
                    color: "rgb(20, 241, 149)"
                  }
                }}
                onClick={handleEyeIconClick}
                title="View full description"
              />
            )}
          </div>
          <span className="transaction-date" title={date}>{date}</span>
        </div>
        <span className="share-transaction-amount"> ₹ {amount}</span>
      </div>

      {/* Detail Modal */}
      <CustomModal
        openModal={showDetailModal}
        isTitle={true}
        title="Transaction Details"
        isFirstButton={true}
        firstButtonType={"close"}
        firstButtonName={"Close"}
        isSecondButton={false}
        maxW="500px"
        closeModal={() => setShowDetailModal(false)}
        firstOnClick={() => setShowDetailModal(false)}
        content={
          <div style={{
            fontFamily: 'var(--primary-font)',
            color: 'white',
            padding: '20px 0'
          }}>
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {clientName && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>Client</span>
                  <span style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>{clientName}</span>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Description</span>
                <span
                  onClick={handleDescriptionClick}
                  style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '400',
                    textAlign: 'right',
                    maxWidth: '60%',
                    lineHeight: '1.4',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      color: 'rgba(255, 255, 255, 0.8)'
                    }
                  }}
                  title="Click to view full description"
                >{message}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Amount</span>
                <span style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'monospace'
                }}>₹ {amount}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Type</span>
                <span style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>{type === "recived" ? "Received" : "Sent"}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0'
              }}>
                <span style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>Date & Time</span>
                <span style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '400'
                }}>{date}</span>
              </div>
            </div>
          </div>
        }
      />

      {/* Description Modal */}
      <CustomModal
        openModal={showDescriptionModal}
        isTitle={true}
        title="Transaction Description"
        isFirstButton={true}
        firstButtonType={"close"}
        firstButtonName={"Close"}
        isSecondButton={false}
        maxW="600px"
        closeModal={() => setShowDescriptionModal(false)}
        firstOnClick={() => setShowDescriptionModal(false)}
        content={
          <div style={{
            fontFamily: 'var(--primary-font)',
            color: 'white',
            padding: '20px 0'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>Full Description</h3>
              <div style={{
                color: 'white',
                fontSize: '14px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {message}
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}
