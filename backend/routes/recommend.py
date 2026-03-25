from flask import Blueprint, request, jsonify

recommend_bp = Blueprint('recommend', __name__)

# Our own recommendation algorithm - no AI needed!
CROP_DATA = {
    'Rice': {
        'seasons': ['summer'],
        'regions': ['terai', 'inner terai', 'low hill'],
        'rainfall': 'high',
        'temp_min': 20, 'temp_max': 40,
        'soil': ['clay', 'loam'],
        'description': 'Best staple crop for warm, wet lowland areas.',
        'nepali': 'धान'
    },
    'Wheat': {
        'seasons': ['winter'],
        'regions': ['terai', 'inner terai', 'hill'],
        'rainfall': 'moderate',
        'temp_min': 5, 'temp_max': 25,
        'soil': ['loam', 'clay loam'],
        'description': 'Ideal winter crop for flat and hilly regions.',
        'nepali': 'गहुँ'
    },
    'Maize': {
        'seasons': ['summer', 'spring'],
        'regions': ['hill', 'mountain', 'inner terai'],
        'rainfall': 'moderate',
        'temp_min': 15, 'temp_max': 35,
        'soil': ['loam', 'sandy loam'],
        'description': 'Versatile crop suited for hilly terrain.',
        'nepali': 'मकै'
    },
    'Potato': {
        'seasons': ['winter', 'spring'],
        'regions': ['hill', 'mountain'],
        'rainfall': 'moderate',
        'temp_min': 5, 'temp_max': 20,
        'soil': ['loam', 'sandy loam'],
        'description': 'Major cash crop for cool hill and mountain areas.',
        'nepali': 'आलु'
    },
    'Tomato': {
        'seasons': ['summer', 'winter', 'spring'],
        'regions': ['terai', 'hill', 'inner terai'],
        'rainfall': 'moderate',
        'temp_min': 15, 'temp_max': 30,
        'soil': ['loam', 'sandy loam', 'clay loam'],
        'description': 'Popular vegetable crop grown across all regions.',
        'nepali': 'टमाटर'
    },
    'Mustard': {
        'seasons': ['winter'],
        'regions': ['terai', 'inner terai'],
        'rainfall': 'low',
        'temp_min': 5, 'temp_max': 25,
        'soil': ['loam', 'clay loam'],
        'description': 'Important oilseed crop for dry winter lowlands.',
        'nepali': 'तोरी'
    },
    'Sugarcane': {
        'seasons': ['summer', 'spring'],
        'regions': ['terai'],
        'rainfall': 'high',
        'temp_min': 20, 'temp_max': 40,
        'soil': ['loam', 'clay loam'],
        'description': 'Cash crop for hot and humid terai regions.',
        'nepali': 'उखु'
    },
    'Lentil': {
        'seasons': ['winter'],
        'regions': ['terai', 'inner terai', 'hill'],
        'rainfall': 'low',
        'temp_min': 5, 'temp_max': 25,
        'soil': ['loam', 'sandy loam'],
        'description': 'Protein-rich legume crop for dry winter areas.',
        'nepali': 'मसुर'
    },
    'Ginger': {
        'seasons': ['summer', 'spring'],
        'regions': ['hill', 'inner terai'],
        'rainfall': 'high',
        'temp_min': 15, 'temp_max': 30,
        'soil': ['loam', 'sandy loam'],
        'description': 'High value cash crop for humid hill areas.',
        'nepali': 'अदुवा'
    },
    'Buckwheat': {
        'seasons': ['summer'],
        'regions': ['mountain', 'high hill'],
        'rainfall': 'moderate',
        'temp_min': 5, 'temp_max': 20,
        'soil': ['loam', 'sandy loam'],
        'description': 'Hardy crop suited for high altitude mountain areas.',
        'nepali': 'फापर'
    },
}

def calculate_score(crop_info, region, season, soil, rainfall):
    score = 0
    reasons = []

    # Region match (40 points)
    region_lower = region.lower()
    if any(r in region_lower for r in crop_info['regions']):
        score += 40
        reasons.append(f"✅ Suitable for {region} region")
    else:
        reasons.append(f"⚠️ Not ideal for {region} region")

    # Season match (30 points)
    if season.lower() in crop_info['seasons']:
        score += 30
        reasons.append(f"✅ Grows well in {season} season")
    else:
        reasons.append(f"⚠️ Not the best season")

    # Soil match (20 points)
    if soil.lower() in crop_info['soil']:
        score += 20
        reasons.append(f"✅ Suitable for {soil} soil")
    else:
        reasons.append(f"⚠️ Soil type not ideal")

    # Rainfall match (10 points)
    if rainfall.lower() == crop_info['rainfall']:
        score += 10
        reasons.append(f"✅ Matches {rainfall} rainfall")
    else:
        reasons.append(f"⚠️ Rainfall not ideal")

    return score, reasons

@recommend_bp.route('/', methods=['POST'])
def recommend():
    data = request.get_json()
    region = data.get('region', '')
    season = data.get('season', '')
    soil = data.get('soil', '')
    rainfall = data.get('rainfall', '')

    if not all([region, season, soil, rainfall]):
        return jsonify({'error': 'All fields are required'}), 400

    results = []
    for crop_name, crop_info in CROP_DATA.items():
        score, reasons = calculate_score(crop_info, region, season, soil, rainfall)
        results.append({
            'name': crop_name,
            'nepali_name': crop_info['nepali'],
            'score': score,
            'reasons': reasons,
            'description': crop_info['description'],
            'seasons': crop_info['seasons'],
            'best_soil': ', '.join(crop_info['soil']),
        })

    # Sort by score descending
    results.sort(key=lambda x: x['score'], reverse=True)

    # Return top 5
    return jsonify(results[:5]), 200