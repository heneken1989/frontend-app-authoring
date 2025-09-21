import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Card } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';

const VocabMatchingForm = ({ quizData, setQuizData }) => {
  const [newDropZone, setNewDropZone] = useState({ x: '', y: '', answer: '' });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageError, setImageError] = useState(null);
  const imageRef = useRef(null);

  // Get the full image URL including the base URL
  const getFullImageUrl = (assetUrl) => {
    if (!assetUrl) return '';
    if (assetUrl.startsWith('http')) return assetUrl;
    const fullUrl = `${getConfig().LMS_BASE_URL}${assetUrl}`;
    console.log('Image URL:', assetUrl);
    console.log('Full URL:', fullUrl);
    return fullUrl;
  };

  // Load image dimensions when image URL changes
  useEffect(() => {
    // Clear any previous errors when image changes
    setImageError(null);
    
    if (quizData.imageFile && quizData.imageFile.trim()) {
      console.log('Loading image:', quizData.imageFile);
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded successfully:', img.width, 'x', img.height);
        setImageSize({ width: img.width, height: img.height });
        setImageError(null); // Clear any previous errors
      };
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        console.error('Image URL:', getFullImageUrl(quizData.imageFile));
        setImageError(`Failed to load image: ${getFullImageUrl(quizData.imageFile)}`);
        setImageSize({ width: 0, height: 0 });
      };
      img.src = getFullImageUrl(quizData.imageFile);
    } else {
      console.log('No image file provided');
      setImageSize({ width: 0, height: 0 });
      setImageError(null);
    }
  }, [quizData.imageFile]);

  const handleImageClick = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = imageSize.width / rect.width;
    const scaleY = imageSize.height / rect.height;

    // Calculate coordinates relative to the image
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    setNewDropZone(prev => ({ ...prev, x: x.toString(), y: y.toString() }));
  };

  const handleAddDropZone = () => {
    if (newDropZone.x && newDropZone.y && newDropZone.answer) {
      const currentDropZones = quizData.dropZones ? JSON.parse(quizData.dropZones) : [];
      const updatedDropZones = [...currentDropZones, newDropZone];
      
      setQuizData(prev => ({
        ...prev,
        dropZones: JSON.stringify(updatedDropZones)
      }));
      
      // Reset form
      setNewDropZone({ x: '', y: '', answer: '' });
    }
  };

  const handleRemoveDropZone = (index) => {
    const currentDropZones = JSON.parse(quizData.dropZones || '[]');
    currentDropZones.splice(index, 1);
    setQuizData(prev => ({
      ...prev,
      dropZones: JSON.stringify(currentDropZones)
    }));
  };

  const handleWordsChange = (e) => {
    setQuizData(prev => ({
      ...prev,
      words: e.target.value
    }));
  };

  return (
    <>
      <Form.Group>
        <Form.Label>Image File URL</Form.Label>
        <Form.Control
          type="text"
          value={quizData.imageFile}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              imageFile: e.target.value
            }));
          }}
          placeholder="/asset-v1:OrganizationX+CourseNumber+Term+type@asset+block/filename.jpg"
        />
        <Form.Text>
          Enter the URL of the image file. You can upload an image file and paste its URL here.
        </Form.Text>
      </Form.Group>

      {quizData.imageFile && quizData.imageFile.trim() && (
        <Card className="mb-4">
          <Card.Header>
            Click on the image to set drop zone position
            {imageSize.width > 0 && imageSize.height > 0 && (
              <span className="text-muted ms-2">
                ({imageSize.width} x {imageSize.height}px)
              </span>
            )}
          </Card.Header>
          <Card.Body className="p-0 position-relative">
            <div style={{ position: 'relative', minHeight: '200px' }}>
              {imageError ? (
                <div className="alert alert-danger m-3">
                  <strong>Error loading image:</strong><br />
                  {imageError}<br />
                  Please check the image URL and try again.
                </div>
              ) : (
                <>
                  <img
                    ref={imageRef}
                    src={getFullImageUrl(quizData.imageFile)}
                    alt="Quiz"
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      cursor: 'crosshair',
                      display: 'block'
                    }}
                    onClick={handleImageClick}
                    onError={(e) => {
                      console.error('Error loading image in display:', e);
                      console.error('Failed URL:', getFullImageUrl(quizData.imageFile));
                      setImageError(`Failed to load image: ${getFullImageUrl(quizData.imageFile)}`);
                    }}
                  />
                  {/* Overlay existing drop zones */}
                  {quizData.dropZones && imageSize.width > 0 && imageSize.height > 0 && 
                   JSON.parse(quizData.dropZones).map((zone, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        left: `${(zone.x / imageSize.width) * 100}%`,
                        top: `${(zone.y / imageSize.height) * 100}%`,
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </Card.Body>
        </Card>
      )}

      <Form.Group>
        <Form.Label>Word Bank</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={quizData.words}
          onChange={handleWordsChange}
          placeholder="Enter words separated by commas (e.g., chair, table, lamp)"
        />
        <Form.Text>
          Enter the vocabulary words that will be available in the word bank, separated by commas.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Add Drop Zone</Form.Label>
        <div className="d-flex gap-2 mb-2">
          <Form.Control
            type="number"
            value={newDropZone.x}
            onChange={(e) => setNewDropZone(prev => ({ ...prev, x: e.target.value }))}
            placeholder="X coordinate"
            readOnly
          />
          <Form.Control
            type="number"
            value={newDropZone.y}
            onChange={(e) => setNewDropZone(prev => ({ ...prev, y: e.target.value }))}
            placeholder="Y coordinate"
            readOnly
          />
          <Form.Control
            type="text"
            value={newDropZone.answer}
            onChange={(e) => setNewDropZone(prev => ({ ...prev, answer: e.target.value }))}
            placeholder="Correct word"
          />
          <Button
            variant="primary"
            onClick={handleAddDropZone}
            disabled={!newDropZone.x || !newDropZone.y || !newDropZone.answer}
          >
            Add
          </Button>
        </div>
        <Form.Text>
          Click on the image above to set the position, then enter the correct word and click Add.
        </Form.Text>
      </Form.Group>

      {/* Display current drop zones */}
      {quizData.dropZones && JSON.parse(quizData.dropZones).length > 0 && (
        <Form.Group>
          <Form.Label>Current Drop Zones</Form.Label>
          <div className="border rounded p-3">
            {JSON.parse(quizData.dropZones).map((zone, index) => (
              <div key={index} className="d-flex gap-2 align-items-center mb-2">
                <span>X: {zone.x}</span>
                <span>Y: {zone.y}</span>
                <span>Word: {zone.answer}</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveDropZone(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </Form.Group>
      )}

      <Form.Group>
        <Form.Label>Instructions</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={quizData.instructions}
          onChange={(e) => {
            setQuizData(prev => ({
              ...prev,
              instructions: e.target.value
            }));
          }}
          placeholder="画像の正しい位置に単語をドラッグしてください。"
        />
        <Form.Text>
          Instructions that will appear above the quiz. Default is in Japanese: "Drag the words to their correct positions on the image."
        </Form.Text>
      </Form.Group>
    </>
  );
};

VocabMatchingForm.propTypes = {
  quizData: PropTypes.object.isRequired,
  setQuizData: PropTypes.func.isRequired,
};

export default VocabMatchingForm; 